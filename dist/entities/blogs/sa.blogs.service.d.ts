import { UsersRepository } from '../users/users.repository';
import { Repository } from 'typeorm';
import { BlogOwnerInfo } from './domain/blogOwner.entity';
export declare class SuperAdminBlogsService {
    private readonly blogOwnerInfoRepository;
    protected usersRepository: UsersRepository;
    constructor(blogOwnerInfoRepository: Repository<BlogOwnerInfo>, usersRepository: UsersRepository);
    bindBlog(blogId: number, userId: number): Promise<void>;
}
