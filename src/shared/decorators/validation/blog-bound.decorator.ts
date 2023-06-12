import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../../../features/public/blogs/blogs.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogOwnerInfoEntity } from '../../../features/blogger/domain/blog-owner-info.entity';

@ValidatorConstraint({ name: 'IsBlogExists', async: true })
@Injectable()
export class IsBlogAttachedDecorator implements ValidatorConstraintInterface {
  constructor(
    private blogsRepository: BlogsRepository,
    @InjectRepository(BlogOwnerInfoEntity)
    private readonly blogOwnerRepository: Repository<BlogOwnerInfoEntity>,
  ) {}
  async validate(blogId: number, args: ValidationArguments) {
    const blog = await this.blogsRepository.findBlogById(blogId);
    if (!blog) return false;
    const ownerInfo = await this.blogOwnerRepository.findOneBy({ blogId: blogId });
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
