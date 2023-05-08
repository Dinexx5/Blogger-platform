import { DataSource, Repository } from 'typeorm';
import { Comment } from './domain/comment.entity';
import { CommentatorInfo } from './domain/commentatorInfo.entity';
export declare class CommentsRepository {
    protected dataSource: DataSource;
    private readonly commentsTypeOrmRepository;
    private readonly commentatorInfoTypeOrmRepository;
    constructor(dataSource: DataSource, commentsTypeOrmRepository: Repository<Comment>, commentatorInfoTypeOrmRepository: Repository<CommentatorInfo>);
    findComment(commentId: number): Promise<Comment>;
    findBannedComments(userId: number): Promise<number[]>;
}
