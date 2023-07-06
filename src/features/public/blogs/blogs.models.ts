import { IsBoolean, IsNotEmpty } from 'class-validator';
import { IsBlogAttached } from '../../../shared/decorators/validation/blog-bound.decorator';
import { IsUserExists } from '../../../shared/decorators/validation/user-exists.decorator';
import { Transform } from 'class-transformer';
import { PictureViewModel } from '../../blogger/dto/post-picture-view-model.dto';

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
  id: string;
  name: string;
  description: string;
  isMembership: boolean;
  websiteUrl: string;
  createdAt: string;
  images: { wallpaper: PictureViewModel | null; main: PictureViewModel[] | [] };
  currentUserSubscriptionStatus: 'Subscribed' | 'Unsubscribed' | 'None';
  subscribersCount: number;
}

export class BlogSAViewModel extends BlogViewModel {
  blogOwnerInfo: object;
  banInfo: object;
}
