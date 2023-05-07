import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BlogViewModel } from './blogs.models';
import { BansRepository } from '../bans/bans.repository';
import { BlogBansRepository } from '../bans/bans.blogs.repository';
import { Repository } from 'typeorm';
import { Blog } from './domain/blog.entity';
export declare class BlogsQueryRepository {
    protected bansRepository: BansRepository;
    protected blogBansRepository: BlogBansRepository;
    private readonly blogsTypeOrmRepository;
    constructor(bansRepository: BansRepository, blogBansRepository: BlogBansRepository, blogsTypeOrmRepository: Repository<Blog>);
    mapFoundBlogToBlogViewModel(blog: any): BlogViewModel;
    getAllBlogs(query: paginationQuerys, userId?: string): Promise<paginatedViewModel<BlogViewModel[]>>;
    findBlogById(blogId: number): Promise<BlogViewModel | null>;
}
