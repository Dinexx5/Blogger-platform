import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileStorageAdapter } from '../../../../adapters/file-storage.adapter';
import { BlogsService } from '../blogs.service';
import { PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import sharp from 'sharp';
import { PostsService } from '../../../public/posts/posts.service';
import { PostMainPictureEntity } from '../../domain/post-main-picture.entity';
import { PostPictureViewModel } from '../../dto/post-picture-view-model.dto';

export class UploadPostMainCommand {
  constructor(
    public blogId: number,
    public postId: number,
    public userId: number,
    public buffer: Buffer,
  ) {}
}

@CommandHandler(UploadPostMainCommand)
export class UploadPostMainUseCase implements ICommandHandler<UploadPostMainCommand> {
  constructor(
    private fileStorageAdapter: FileStorageAdapter,
    protected blogsService: BlogsService,
    protected postsService: PostsService,
    @InjectRepository(PostMainPictureEntity)
    private readonly postMainPicturesRepository: Repository<PostMainPictureEntity>,
  ) {}

  async execute(command: UploadPostMainCommand): Promise<PostPictureViewModel> {
    const { blogId, postId, userId, buffer } = command;
    await this.blogsService.checkBlogExists(blogId);
    await this.blogsService.checkPermission(blogId, userId);
    await this.postsService.checkPostExists(postId);

    const isAlreadyUploaded = await this.postMainPicturesRepository.findOneBy({
      userId: userId,
      postId: postId,
    });

    if (isAlreadyUploaded) {
      await this.postMainPicturesRepository.remove(isAlreadyUploaded);
      // await this.fileStorageAdapter.deleteFile(blogId, 'wallpaper');
    }

    const sizes = [
      { width: 940, height: 432, sizeName: 'original' },
      { width: 300, height: 180, sizeName: 'middle' },
      { width: 149, height: 96, sizeName: 'small' },
    ];
    const uploadedImages = [];
    for (let i = 0; i < sizes.length; i++) {
      const { width, height, sizeName } = sizes[i];

      const resizedBuffer = await this.resizeImage(buffer, width, height);
      const uploadResult: PutObjectCommandOutput = await this.fileStorageAdapter.uploadPostFile(
        blogId,
        postId,
        resizedBuffer,
        sizeName,
      );
      const fileMeta = await sharp(resizedBuffer).metadata();
      const fileSize = fileMeta.size;
      const newMainPicture = PostMainPictureEntity.create(
        blogId,
        postId,
        userId,
        uploadResult.ETag,
        fileSize,
      );
      await this.postMainPicturesRepository.save(newMainPicture);
      uploadedImages.push({
        url: `content/blogs/${blogId}/posts/${postId}/main/${postId}_main_${sizeName}`,
        width: width,
        height: height,
        fileSize: fileSize,
      });
    }

    return {
      main: uploadedImages,
    };
  }
  async resizeImage(buffer: Buffer, width: number, height: number): Promise<Buffer> {
    const imageBuffer = await sharp(buffer).resize(width, height).toBuffer();

    return imageBuffer;
  }
}
