import { DataSource, Repository } from 'typeorm';
import { Comment } from './domain/comment.entity';
export declare class CommentsRepository {
    protected dataSource: DataSource;
    private readonly commentsTypeOrmRepository;
    constructor(dataSource: DataSource, commentsTypeOrmRepository: Repository<Comment>);
    findComment(commentId: number): Promise<Comment>;
    findBannedComments(userId: string): Promise<any>;
}
