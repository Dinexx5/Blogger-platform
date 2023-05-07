import { CommentsRepository } from './comments.repository';
import { UsersRepository } from '../users/users.repository';
import { CommentViewModel, CreateCommentModel, UpdateCommentModel } from './comments.models';
import { PostsRepository } from '../posts/posts.repository';
import { Repository } from 'typeorm';
import { Comment } from './domain/comment.entity';
import { CommentatorInfo } from './domain/commentatorInfo.entity';
import { PostInfoForComment } from './domain/postInfo.entity';
import { CommentLike } from '../likes/domain/commentLike.entity';
export declare class CommentsService {
    protected commentsRepository: CommentsRepository;
    protected postsRepository: PostsRepository;
    protected usersRepository: UsersRepository;
    private readonly commentsTypeOrmRepository;
    private readonly commentatorInfoRepository;
    private readonly postInfoRepository;
    private readonly commentsLikesRepository;
    constructor(commentsRepository: CommentsRepository, postsRepository: PostsRepository, usersRepository: UsersRepository, commentsTypeOrmRepository: Repository<Comment>, commentatorInfoRepository: Repository<CommentatorInfo>, postInfoRepository: Repository<PostInfoForComment>, commentsLikesRepository: Repository<CommentLike>);
    createComment(postId: number, inputModel: CreateCommentModel, userId: number): Promise<CommentViewModel>;
    updateCommentById(commentId: number, inputModel: UpdateCommentModel, userId: number): Promise<void>;
    deleteCommentById(commentId: number, userId: number): Promise<void>;
    likeComment(commentId: number, likeStatus: string, userId: number): Promise<boolean>;
}
