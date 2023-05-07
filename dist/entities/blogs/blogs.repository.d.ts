import { DataSource, Repository } from 'typeorm';
import { Blog } from './domain/blog.entity';
import { BlogOwnerInfo } from './domain/blogOwner.entity';
export declare class BlogsRepository {
    protected dataSource: DataSource;
    private readonly blogsTypeOrmRepository;
    private readonly blogOwnerInfoTypeOrmRepository;
    constructor(dataSource: DataSource, blogsTypeOrmRepository: Repository<Blog>, blogOwnerInfoTypeOrmRepository: Repository<BlogOwnerInfo>);
    findBlogById(blogId: number): Promise<Blog>;
    findBlogsForUser(userId: number): Promise<number[]>;
}
