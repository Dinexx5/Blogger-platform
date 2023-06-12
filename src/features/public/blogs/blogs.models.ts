import { IsBoolean, IsNotEmpty } from 'class-validator';
import { IsBlogAttached } from '../../../shared/decorators/validation/blog-bound.decorator';
import { IsUserExists } from '../../../shared/decorators/validation/user-exists.decorator';
import { Transform } from 'class-transformer';

export class blogParamModel {
  // @IsBlogExists()
  @Transform(({ value }) => +value)
  blogId: number;
}

export class BanBlogModel {
  @IsBoolean()
  @IsNotEmpty()
  isBanned: boolean;
}

export class blogAndPostParamModel {
  // @IsBlogExists()
  @Transform(({ value }) => +value)
  blogId: number;
  @Transform(({ value }) => +value)
  postId: number;
}

export class blogAndUserParamModel {
  @IsBlogAttached()
  @Transform(({ value }) => +value)
  blogId: number;
  @IsUserExists()
  @Transform(({ value }) => +value)
  userId: number;
}

export class BlogViewModel {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public isMembership: boolean,
    public websiteUrl: string,
    public createdAt: string,
  ) {}
}

export class BlogSAViewModel {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public isMembership: boolean,
    public websiteUrl: string,
    public createdAt: string,
    public blogOwnerInfo: object,
    public banInfo: object,
  ) {}
}
