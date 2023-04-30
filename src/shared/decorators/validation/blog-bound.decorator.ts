import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../../../entities/blogs/blogs.repository';

@ValidatorConstraint({ name: 'IsBlogExists', async: true })
@Injectable()
export class IsBlogAttachedDecorator implements ValidatorConstraintInterface {
  constructor(private blogsRepository: BlogsRepository) {}
  async validate(blogId: string, args: ValidationArguments) {
    const blog = await this.blogsRepository.findBlogInstance(blogId);
    if (!blog) return false;
    const ownerInfo = await this.blogsRepository.findBlogOwnerInfo(blog.id.toString());
    if (ownerInfo.userId) return false;
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `Blog already bound or doesn't exist`;
  }
}

export function IsBlogAttached(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsBlogExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsBlogAttachedDecorator,
    });
  };
}
