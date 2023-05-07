import { Post } from '../../posts/domain/post.entity';
import { User } from '../../users/domain/user.entity';
export declare class PostLike {
    likeStatus: string;
    login: string;
    postId: number;
    userId: number;
    createdAt: string;
    post: Post;
    user: User;
}
