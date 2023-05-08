import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BansRepository } from '../bans/bans.repository';
import { CommentViewModel } from './comments.models';
import { Repository } from 'typeorm';
import { Comment } from './domain/comment.entity';
export declare class CommentsQueryRepository {
    protected bansRepository: BansRepository;
    private readonly commentsTypeOrmRepository;
    constructor(bansRepository: BansRepository, commentsTypeOrmRepository: Repository<Comment>);
    mapperToCommentViewModel(comment: any): CommentViewModel;
    getAllCommentsForPost(query: paginationQuerys, postId: number, userId?: number | null): Promise<paginatedViewModel<CommentViewModel[]>>;
    getBuilder(userId?: number): Promise<import("typeorm").SelectQueryBuilder<Comment>>;
    findCommentById(commentId: number, userId?: number | null): Promise<CommentViewModel | null>;
}
