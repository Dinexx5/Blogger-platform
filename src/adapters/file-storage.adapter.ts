import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class FileStorageAdapter {
  s3Client: S3Client;
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.REGION,
      endpoint: process.env.ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
  }
  async uploadBlogFile(
    blogId: number,
    imageType: string,
    buffer: Buffer,
  ): Promise<PutObjectCommandOutput> {
    const bucketParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: `content/blogs/${blogId}/${imageType}/${blogId}_${imageType}.png`,
      Body: buffer,
      ContentType: 'image/png',
    };

    const command = new PutObjectCommand(bucketParams);

    try {
      const uploadResult: PutObjectCommandOutput = await this.s3Client.send(command);
      return uploadResult;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async uploadPostFile(
    blogId: number,
    postId: number,
    buffer: Buffer,
    sizeName: string,
  ): Promise<PutObjectCommandOutput> {
    const bucketParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: `content/blogs/${blogId}/posts/${postId}/main/${postId}_main_${sizeName}`,
      Body: buffer,
      ContentType: 'image/png',
    };

    const command = new PutObjectCommand(bucketParams);

    try {
      const uploadResult: PutObjectCommandOutput = await this.s3Client.send(command);
      return uploadResult;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  // async deleteFile(blogId: number, imageType: string): Promise<DeleteObjectCommandOutput> {
  //   const bucketParams = {
  //     Bucket: 'blogger.platform',
  //     Key: `content/blogs/${blogId}/${imageType}/${blogId}_${imageType}`,
  //   };
  //
  //   const command = new DeleteObjectCommand(bucketParams);
  //
  //   try {
  //     const deleteResult: DeleteObjectCommandOutput = await this.s3Client.send(command);
  //     return deleteResult;
  //   } catch (err) {
  //     console.error(err);
  //     throw err;
  //   }
  // }
}
