import { BlogsRepository } from './blogs.repository';
import { UsersRepository } from '../users/users.repository';
import { BlogViewModel, createBlogModel, updateBlogModel } from './blogs.models';
import { Repository } from 'typeorm';
import { Blog } from './domain/blog.entity';
import { BlogBansInfo } from './domain/blogBansInfo.entity';
import { BlogOwnerInfo } from './domain/blogOwner.entity';
export declare class BlogsService {
    protected blogsRepository: BlogsRepository;
    protected usersRepository: UsersRepository;
    private readonly blogsTypeOrmRepository;
    private readonly blogBanInfoRepository;
    private readonly blogOwnerInfoRepository;
    constructor(blogsRepository: BlogsRepository, usersRepository: UsersRepository, blogsTypeOrmRepository: Repository<Blog>, blogBanInfoRepository: Repository<BlogBansInfo>, blogOwnerInfoRepository: Repository<BlogOwnerInfo>);
    createBlog(inputModel: createBlogModel, userId: number): Promise<BlogViewModel>;
    deleteBlogById(blogId: number, userId: number): Promise<void>;
    UpdateBlogById(blogBody: updateBlogModel, blogId: number, userId: number): Promise<void>;
}
