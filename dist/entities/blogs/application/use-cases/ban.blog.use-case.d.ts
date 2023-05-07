import { ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../posts/posts.repository';
import { BanBlogModel } from '../../blogs.models';
import { BlogsRepository } from '../../blogs.repository';
import { Repository } from 'typeorm';
import { SaBlogBan } from '../../../bans/domain/saBlogBan.entity';
import { BlogBansInfo } from '../../domain/blogBansInfo.entity';
export declare class BanBlogCommand {
    blogId: number;
    inputModel: BanBlogModel;
    constructor(blogId: number, inputModel: BanBlogModel);
}
export declare class BansBlogUseCase implements ICommandHandler<BanBlogCommand> {
    protected blogsRepository: BlogsRepository;
    protected postsRepository: PostsRepository;
    private readonly blogBansInfoRepository;
    private readonly blogBansRepository;
    constructor(blogsRepository: BlogsRepository, postsRepository: PostsRepository, blogBansInfoRepository: Repository<BlogBansInfo>, blogBansRepository: Repository<SaBlogBan>);
    execute(command: BanBlogCommand): Promise<boolean>;
}
