import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class NewestLikes {
  addedAt: string;
  userId: string;
  login: string;
}
export class createPostModel {
  @IsString()
  @IsNotEmpty()
  @Length(0, 30)
  @Transform(({ value }) => value?.trim?.())
  title: string;
  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  @Transform(({ value }) => value?.trim?.())
  shortDescription: string;
  @IsString()
  @IsNotEmpty()
  @Length(0, 1000)
  @Transform(({ value }) => value?.trim?.())
  content: string;
}

export class updatePostModel {
  @IsString()
  @IsNotEmpty()
  @Length(0, 30)
  @Transform(({ value }) => value?.trim?.())
  title: string;
  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  @Transform(({ value }) => value?.trim?.())
  shortDescription: string;
  @IsString()
  @IsNotEmpty()
  @Length(0, 1000)
  @Transform(({ value }) => value?.trim?.())
  content: string;
}

export class PostViewModel {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string,
    public extendedLikesInfo: {
      likesCount: number;
      dislikesCount: number;
      myStatus: string;
      newestLikes: NewestLikes[];
    },
  ) {}
}
