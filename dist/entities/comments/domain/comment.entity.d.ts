import { CommentatorInfo } from './commentatorInfo.entity';
import { PostInfoForComment } from './postInfo.entity';
import { CommentLike } from '../../likes/domain/commentLike.entity';
export declare class Comment {
    id: number;
    content: string;
    createdAt: string;
    commentatorInfo: CommentatorInfo;
    postInfo: PostInfoForComment;
    likes: CommentLike[];
}
