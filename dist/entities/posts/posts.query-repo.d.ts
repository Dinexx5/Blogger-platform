import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BansRepository } from '../bans/bans.repository';
import { BlogBansRepository } from '../bans/bans.blogs.repository';
import { Repository } from 'typeorm';
import { PostViewModel } from './posts.models';
import { Post } from './domain/post.entity';
import { PostLike } from '../likes/domain/postLike.entity';
export declare class PostsQueryRepository {
    protected bansRepository: BansRepository;
    protected blogBansRepository: BlogBansRepository;
    private readonly postsTypeOrmRepository;
    private readonly postsLikesTypeOrmRepository;
    constructor(bansRepository: BansRepository, blogBansRepository: BlogBansRepository, postsTypeOrmRepository: Repository<Post>, postsLikesTypeOrmRepository: Repository<PostLike>);
    mapperToPostViewModel(post: any): PostViewModel;
    getAllPosts(query: paginationQuerys, blogId?: number, userId?: number | null): Promise<paginatedViewModel<PostViewModel[]>>;
    getBuilder(userId?: number): Promise<import("typeorm").SelectQueryBuilder<Post>>;
    findThreeLatestLikesForPosts(posts: any): Promise<void>;
    findPostById(postId: number, userId?: number | null): Promise<PostViewModel | null>;
}
