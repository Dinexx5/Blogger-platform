import { Repository } from 'typeorm';
import { Comment } from './domain/comment.entity';
import { CommentatorInfo } from './domain/commentatorInfo.entity';
export declare class CommentsRepository {
    private readonly commentsTypeOrmRepository;
    private readonly commentatorInfoTypeOrmRepository;
    constructor(commentsTypeOrmRepository: Repository<Comment>, commentatorInfoTypeOrmRepository: Repository<CommentatorInfo>);
    findComment(commentId: number): Promise<Comment>;
    findBannedComments(userId: number): Promise<number[]>;
}
