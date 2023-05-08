import { Repository } from 'typeorm';
import { Blog } from './domain/blog.entity';
import { BlogOwnerInfo } from './domain/blogOwner.entity';
export declare class BlogsRepository {
    private readonly blogsTypeOrmRepository;
    private readonly blogOwnerInfoTypeOrmRepository;
    constructor(blogsTypeOrmRepository: Repository<Blog>, blogOwnerInfoTypeOrmRepository: Repository<BlogOwnerInfo>);
    findBlogById(blogId: number): Promise<Blog>;
    findBlogsForUser(userId: number): Promise<number[]>;
}
