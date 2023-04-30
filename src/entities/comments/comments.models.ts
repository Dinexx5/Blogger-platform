import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsLikeStatusCorrect } from '../../shared/decorators/validation/like-status.decorator';

export class CreateCommentModel {
  @IsString()
  @IsNotEmpty()
  @Length(20, 300)
  @Transform(({ value }) => value?.trim?.())
  content: string;
}

export class LikeInputModel {
  @IsLikeStatusCorrect()
  likeStatus: string;
}

export class CommentViewModel {
  constructor(
    public id: string,
    public content: string,
    public commentatorInfo: {
      userId: string;
      userLogin: string;
    },
    public createdAt: string,
    public likesInfo: {
      likesCount: number;
      dislikesCount: number;
      myStatus: string;
    },
  ) {}
}
export class commentsForBloggerViewModel {
  constructor(
    public id: string,
    public content: string,
    public commentatorInfo: {
      userId: string;
      userLogin: string;
    },
    public createdAt: string,
    public likesInfo: {
      likesCount: number;
      dislikesCount: number;
      myStatus: string;
    },
    public postInfo: {
      id: string;
      title: string;
      blogId: string;
      blogName: string;
    },
  ) {}
}
