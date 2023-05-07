import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BansRepository } from '../bans/bans.repository';
import { PostsLikesRepository } from '../likes/posts.likes.repository';
import { BlogBansRepository } from '../bans/bans.blogs.repository';
import { DataSource } from 'typeorm';
import { PostViewModel } from './posts.models';
export declare class PostsQueryRepository {
    protected bansRepository: BansRepository;
    protected postsLikesRepository: PostsLikesRepository;
    protected blogBansRepository: BlogBansRepository;
    protected dataSource: DataSource;
    constructor(bansRepository: BansRepository, postsLikesRepository: PostsLikesRepository, blogBansRepository: BlogBansRepository, dataSource: DataSource);
    mapperToPostViewModel(post: any): PostViewModel;
    getAllPosts(query: paginationQuerys, blogId?: number, userId?: number | null): Promise<paginatedViewModel<PostViewModel[]>>;
    countLikesForPosts(posts: any, userId?: number): Promise<void>;
    countLikesForPost(post: any, userId?: string): Promise<void>;
    findPostById(postId: string, userId?: string | null): Promise<PostViewModel | null>;
}
