import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BlogsRepository } from '../blogs/blogs.repository';
import { PostsRepository } from '../posts/posts.repository';
import { commentsForBloggerViewModel } from '../comments/comments.models';
import { DataSource, Repository } from 'typeorm';
import { Comment } from '../comments/domain/comment.entity';
export declare class BloggerCommentsQueryRepository {
    protected blogsRepository: BlogsRepository;
    protected postsRepository: PostsRepository;
    protected dataSource: DataSource;
    private readonly commentsTypeOrmRepository;
    constructor(blogsRepository: BlogsRepository, postsRepository: PostsRepository, dataSource: DataSource, commentsTypeOrmRepository: Repository<Comment>);
    mapCommentsToViewModel(comment: any): commentsForBloggerViewModel;
    getAllComments(query: paginationQuerys, userId: number): Promise<paginatedViewModel<commentsForBloggerViewModel[]>>;
}
