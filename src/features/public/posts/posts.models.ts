import { PictureViewModel } from '../../blogger/dto/post-picture-view-model.dto';

export class NewestLikes {
  addedAt: string;
  userId: string;
  login: string;
}

export class PostViewModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: NewestLikes[];
  };
  images: { main: PictureViewModel[] | [] };
}
