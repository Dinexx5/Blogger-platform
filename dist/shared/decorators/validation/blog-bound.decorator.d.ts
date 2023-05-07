import { ValidationOptions, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { BlogsRepository } from '../../../entities/blogs/blogs.repository';
import { Repository } from 'typeorm';
import { BlogOwnerInfo } from '../../../entities/blogs/domain/blogOwner.entity';
export declare class IsBlogAttachedDecorator implements ValidatorConstraintInterface {
    private blogsRepository;
    private readonly blogOwnerRepository;
    constructor(blogsRepository: BlogsRepository, blogOwnerRepository: Repository<BlogOwnerInfo>);
    validate(blogId: number, args: ValidationArguments): Promise<boolean>;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsBlogAttached(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
