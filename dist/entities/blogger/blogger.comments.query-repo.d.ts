import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BlogsRepository } from '../blogs/blogs.repository';
import { PostsRepository } from '../posts/posts.repository';
import { commentsForBloggerViewModel } from '../comments/comments.models';
import { Repository } from 'typeorm';
import { Comment } from '../comments/domain/comment.entity';
import { BansRepository } from '../bans/bans.repository';
export declare class BloggerCommentsQueryRepository {
    protected bansRepository: BansRepository;
    protected blogsRepository: BlogsRepository;
    protected postsRepository: PostsRepository;
    private readonly commentsTypeOrmRepository;
    constructor(bansRepository: BansRepository, blogsRepository: BlogsRepository, postsRepository: PostsRepository, commentsTypeOrmRepository: Repository<Comment>);
    mapCommentsToViewModel(comment: any): commentsForBloggerViewModel;
    getAllComments(query: paginationQuerys, userId: number): Promise<paginatedViewModel<commentsForBloggerViewModel[]>>;
}
