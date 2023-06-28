import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class PostMainValidationPipe implements PipeTransform {
  async transform(file: Express.Multer.File): Promise<any> {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      throw new BadRequestException({ message: ['Invalid image format'] });
    }
    const image = await sharp(file.buffer).metadata();
    const validSize = image.width === 940 && image.height === 432;
    const validSizeInBytes = 100000;
    if (image.size > validSizeInBytes) {
      throw new BadRequestException({ message: ['Invalid image size(bytes)'] });
    }
    if (!validSize) {
      throw new BadRequestException({ message: ['Invalid image size'] });
    }
    return file;
  }
}
