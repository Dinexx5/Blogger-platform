import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileStorageAdapter } from '../../../../adapters/file-storage.adapter';
import { BlogsService } from '../blogs.service';
import { PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { WallpaperEntity } from '../../domain/wallpaper.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPictureViewModel } from '../../dto/blog-picture-view-model.dto';
import sharp from 'sharp';
import { MainPictureEntity } from '../../domain/main-picture.entity';

export class UploadWallpaperCommand {
  constructor(public blogId: number, public userId: number, public buffer: Buffer) {}
}

@CommandHandler(UploadWallpaperCommand)
export class UploadWallpaperUseCase implements ICommandHandler<UploadWallpaperCommand> {
  constructor(
    private fileStorageAdapter: FileStorageAdapter,
    protected blogsService: BlogsService,
    @InjectRepository(WallpaperEntity)
    private readonly wallpapersRepository: Repository<WallpaperEntity>,
    @InjectRepository(MainPictureEntity)
    private readonly mainPictureRepository: Repository<MainPictureEntity>,
  ) {}

  async execute(command: UploadWallpaperCommand): Promise<BlogPictureViewModel> {
    const { blogId, userId, buffer } = command;
    await this.blogsService.checkBlogExists(blogId);
    await this.blogsService.checkPermission(blogId, userId);

    const isAlreadyUploaded = await this.wallpapersRepository.findOneBy({
      userId: userId,
      blogId: blogId,
    });

    if (isAlreadyUploaded) {
      await this.wallpapersRepository.remove(isAlreadyUploaded);
      // await this.fileStorageAdapter.deleteFile(blogId, 'wallpaper');
    }

    const uploadResult: PutObjectCommandOutput = await this.fileStorageAdapter.uploadBlogFile(
      blogId,
      'wallpaper',
      buffer,
    );
    const fileMeta = await sharp(buffer).metadata();
    const fileSize = fileMeta.size;
    const newWallpaper = WallpaperEntity.create(blogId, userId, uploadResult.ETag, fileSize);
    await this.wallpapersRepository.save(newWallpaper);
    const mainPicture = await this.mainPictureRepository.findOneBy({
      userId: userId,
      blogId: blogId,
    });
    return {
      wallpaper: {
        url: `content/blogs/${blogId}/wallpaper/${blogId}_wallpaper`,
        width: 1028,
        height: 312,
        fileSize: fileSize,
      },
      main: mainPicture
        ? [
            {
              url: mainPicture.url,
              width: 156,
              height: 156,
              fileSize: mainPicture.fileSize,
            },
          ]
        : [],
    };
  }
}
