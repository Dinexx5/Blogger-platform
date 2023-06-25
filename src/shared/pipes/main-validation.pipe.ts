import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class MainValidationPipe implements PipeTransform {
  async transform(file: Express.Multer.File): Promise<any> {
    const image = await sharp(file.buffer).metadata();
    const validSize = image.width === 156 && image.height === 156;
    const validSizeInBytes = 100000;
    if (image.format !== 'jpeg' && image.format !== 'png') {
      throw new BadRequestException({ message: ['Invalid image format'] });
    }
    if (image.size > validSizeInBytes) {
      throw new BadRequestException({ message: ['Invalid image size(bytes)'] });
    }
    if (!validSize) {
      throw new BadRequestException({ message: ['Invalid image size'] });
    }
    return file;
  }
}
