import { Comment } from './comment.entity';
import { User } from '../../users/domain/user.entity';
export declare class CommentatorInfo {
    commentId: number;
    userLogin: string;
    user: User;
    comment: Comment;
    userId: number;
}
