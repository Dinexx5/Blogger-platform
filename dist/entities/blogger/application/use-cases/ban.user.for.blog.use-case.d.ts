import { UsersRepository } from '../../../users/users.repository';
import { BanUserModelForBlog } from '../../../users/userModels';
import { BlogsRepository } from '../../../blogs/blogs.repository';
import { PostsRepository } from '../../../posts/posts.repository';
import { ICommandHandler } from '@nestjs/cqrs';
import { BlogOwnerInfo } from '../../../blogs/domain/blogOwner.entity';
import { Repository } from 'typeorm';
import { UserBanForBlog } from '../../domain/userBanForBlog.entity';
export declare class BanUserForBlogCommand {
    userId: number;
    inputModel: BanUserModelForBlog;
    ownerId: number;
    constructor(userId: number, inputModel: BanUserModelForBlog, ownerId: number);
}
export declare class BanUserForBlogUseCase implements ICommandHandler<BanUserForBlogCommand> {
    protected usersRepository: UsersRepository;
    protected postsRepository: PostsRepository;
    protected blogsRepository: BlogsRepository;
    private readonly blogOwnerInfoRepository;
    private readonly usersBansForBlogsRepository;
    constructor(usersRepository: UsersRepository, postsRepository: PostsRepository, blogsRepository: BlogsRepository, blogOwnerInfoRepository: Repository<BlogOwnerInfo>, usersBansForBlogsRepository: Repository<UserBanForBlog>);
    execute(command: BanUserForBlogCommand): Promise<boolean>;
}
