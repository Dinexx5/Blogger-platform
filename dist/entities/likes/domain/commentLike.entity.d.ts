import { User } from '../../users/domain/user.entity';
import { Comment } from '../../comments/domain/comment.entity';
export declare class CommentLike {
    likeStatus: string;
    commentId: number;
    userId: number;
    createdAt: string;
    comment: Comment;
    user: User;
}
