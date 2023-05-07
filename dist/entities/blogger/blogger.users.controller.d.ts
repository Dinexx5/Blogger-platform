import { Response } from 'express';
import { BannedForBlogUserViewModel, BanUserModelForBlog, UserToBanParamModel } from '../users/userModels';
import { CommandBus } from '@nestjs/cqrs';
import { paginatedViewModel } from '../../shared/models/pagination';
import { blogParamModel } from '../blogs/blogs.models';
import { BloggerBansQueryRepository } from './blogger.bans.query-repository';
export declare class BloggerUsersController {
    private commandBus;
    protected bloggerQueryRepository: BloggerBansQueryRepository;
    constructor(commandBus: CommandBus, bloggerQueryRepository: BloggerBansQueryRepository);
    banUser(ownerId: any, param: UserToBanParamModel, inputModel: BanUserModelForBlog, res: Response): Promise<Response<any, Record<string, any>>>;
    getBannedUsers(userId: any, paginationQuery: any, param: blogParamModel): Promise<paginatedViewModel<BannedForBlogUserViewModel[]>>;
}
