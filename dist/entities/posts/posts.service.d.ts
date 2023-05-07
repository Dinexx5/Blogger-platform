import { PostsRepository } from './posts.repository';
import { CommentsService } from '../comments/comments.service';
import { UsersRepository } from '../users/users.repository';
import { BlogsRepository } from '../blogs/blogs.repository';
import { UsersBansForBlogRepository } from '../bans/bans.users-for-blog.repository';
import { CommentViewModel, UpdateCommentModel } from '../comments/comments.models';
import { createPostModel, PostViewModel, updatePostModel } from './posts.models';
import { Repository } from 'typeorm';
import { Post } from './domain/post.entity';
import { BlogOwnerInfo } from '../blogs/domain/blogOwner.entity';
import { PostLike } from '../likes/domain/postLike.entity';
export declare class PostsService {
    protected postsRepository: PostsRepository;
    protected blogsRepository: BlogsRepository;
    protected commentsService: CommentsService;
    protected usersRepository: UsersRepository;
    protected usersBansForBlogsRepo: UsersBansForBlogRepository;
    private readonly postsLikesRepository;
    private readonly blogOwnerInfoRepository;
    private readonly postsTypeOrmRepository;
    constructor(postsRepository: PostsRepository, blogsRepository: BlogsRepository, commentsService: CommentsService, usersRepository: UsersRepository, usersBansForBlogsRepo: UsersBansForBlogRepository, postsLikesRepository: Repository<PostLike>, blogOwnerInfoRepository: Repository<BlogOwnerInfo>, postsTypeOrmRepository: Repository<Post>);
    createPost(postBody: createPostModel, blogId: number, userId: number): Promise<PostViewModel | null>;
    deletePostById(postId: number, blogId: number, userId: number): Promise<void>;
    updatePostById(postBody: updatePostModel, postId: number, blogId: number, userId: number): Promise<void>;
    createComment(postId: number, inputModel: UpdateCommentModel, userId: number): Promise<CommentViewModel | null>;
    likePost(postId: number, likeStatus: string, userId: number): Promise<boolean>;
}
