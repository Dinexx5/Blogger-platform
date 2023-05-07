import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BansRepository } from '../bans/bans.repository';
import { CommentsLikesRepository } from '../likes/comments.likes.repository';
import { CommentViewModel } from './comments.models';
import { DataSource } from 'typeorm';
export declare class CommentsQueryRepository {
    protected bansRepository: BansRepository;
    protected commentsLikesRepository: CommentsLikesRepository;
    protected dataSource: DataSource;
    constructor(bansRepository: BansRepository, commentsLikesRepository: CommentsLikesRepository, dataSource: DataSource);
    mapperToCommentViewModel(comment: any): CommentViewModel;
    getAllCommentsForPost(query: paginationQuerys, postId: string, userId?: string | null): Promise<paginatedViewModel<CommentViewModel[]>>;
    countLikesForComments(comments: any, userId?: string): Promise<void>;
    countLikesForComment(comment: any, userId?: string): Promise<void>;
    findCommentById(commentId: string, userId?: string | null): Promise<CommentViewModel | null>;
}
