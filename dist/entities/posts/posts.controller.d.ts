import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { Response } from 'express';
import { PostsService } from './posts.service';
import { PostsQueryRepository } from './posts.query-repo';
import { CommentsQueryRepository } from '../comments/comments.query-repo';
import { UpdateCommentModel, LikeInputModel } from '../comments/comments.models';
import { PostViewModel } from './posts.models';
export declare class PostsController {
    protected postsService: PostsService;
    protected postsQueryRepository: PostsQueryRepository;
    protected commentsQueryRepository: CommentsQueryRepository;
    constructor(postsService: PostsService, postsQueryRepository: PostsQueryRepository, commentsQueryRepository: CommentsQueryRepository);
    getPosts(userId: any, paginationQuery: any): Promise<paginatedViewModel<PostViewModel[]>>;
    getPost(userId: any, id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getComments(userId: any, postId: string, paginationQuery: paginationQuerys, res: Response): Promise<Response<any, Record<string, any>>>;
    createComment(userId: any, postId: number, inputModel: UpdateCommentModel, res: Response): Promise<Response<any, Record<string, any>>>;
    likePost(userId: any, postId: number, inputModel: LikeInputModel, res: Response): Promise<Response<any, Record<string, any>>>;
}
