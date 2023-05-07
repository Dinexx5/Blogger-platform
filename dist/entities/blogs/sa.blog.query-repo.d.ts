import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BlogSAViewModel } from './blogs.models';
import { Repository } from 'typeorm';
import { Blog } from './domain/blog.entity';
export declare class BlogsSAQueryRepository {
    private readonly blogsTypeOrmRepository;
    constructor(blogsTypeOrmRepository: Repository<Blog>);
    mapFoundBlogToBlogViewModel(blog: any): BlogSAViewModel;
    getAllBlogs(query: paginationQuerys): Promise<paginatedViewModel<BlogSAViewModel[]>>;
}
