import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileStorageAdapter } from '../../../../adapters/file-storage.adapter';
import { BlogsService } from '../blogs.service';
import { PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPictureViewModel } from '../../dto/blog-picture-view-model.dto';
import sharp from 'sharp';
import { MainPictureEntity } from '../../domain/main-picture.entity';
import { WallpaperEntity } from '../../domain/wallpaper.entity';

export class UploadMainCommand {
  constructor(public blogId: number, public userId: number, public buffer: Buffer) {}
}

@CommandHandler(UploadMainCommand)
export class UploadMainUseCase implements ICommandHandler<UploadMainCommand> {
  constructor(
    private fileStorageAdapter: FileStorageAdapter,
    protected blogsService: BlogsService,
    @InjectRepository(WallpaperEntity)
    private readonly wallpapersRepository: Repository<WallpaperEntity>,
    @InjectRepository(MainPictureEntity)
    private readonly mainPicturesRepository: Repository<MainPictureEntity>,
  ) {}

  async execute(command: UploadMainCommand): Promise<BlogPictureViewModel> {
    const { blogId, userId, buffer } = command;
    await this.blogsService.checkBlogExists(blogId);
    await this.blogsService.checkPermission(blogId, userId);

    const isAlreadyUploaded = await this.mainPicturesRepository.findOneBy({
      userId: userId,
      blogId: blogId,
    });

    if (isAlreadyUploaded) {
      await this.mainPicturesRepository.remove(isAlreadyUploaded);
      // await this.fileStorageAdapter.deleteFile(blogId, 'wallpaper');
    }

    const uploadResult: PutObjectCommandOutput = await this.fileStorageAdapter.uploadBlogFile(
      blogId,
      'main',
      buffer,
    );
    const fileMeta = await sharp(buffer).metadata();
    const fileSize = fileMeta.size;
    const newMainPicture = MainPictureEntity.create(blogId, userId, uploadResult.ETag, fileSize);
    await this.mainPicturesRepository.save(newMainPicture);

    const wallpaper = await this.wallpapersRepository.findOneBy({
      userId: userId,
      blogId: blogId,
    });

    return {
      wallpaper: wallpaper
        ? {
            url: wallpaper.relativeUrl,
            width: 1028,
            height: 312,
            fileSize: wallpaper.fileSize,
          }
        : [],
      main: [
        {
          url: `content/blogs/${blogId}/main/${blogId}_main`,
          width: 156,
          height: 156,
          fileSize: fileSize,
        },
      ],
    };
  }
}
