import { paginatedViewModel } from '../../shared/models/pagination';
import { Response } from 'express';
import { BanBlogModel, blogAndUserParamModel, blogParamModel, BlogSAViewModel } from './blogs.models';
import { SuperAdminBlogsService } from './sa.blogs.service';
import { BlogsSAQueryRepository } from './sa.blog.query-repo';
import { CommandBus } from '@nestjs/cqrs';
export declare class SuperAdminBlogsController {
    private commandBus;
    protected superAdminBlogsQueryRepository: BlogsSAQueryRepository;
    protected superAdminBlogService: SuperAdminBlogsService;
    constructor(commandBus: CommandBus, superAdminBlogsQueryRepository: BlogsSAQueryRepository, superAdminBlogService: SuperAdminBlogsService);
    getBlogs(paginationQuery: any): Promise<paginatedViewModel<BlogSAViewModel[]>>;
    bindBlog(params: blogAndUserParamModel, res: Response): Promise<Response<any, Record<string, any>>>;
    banBlog(params: blogParamModel, inputModel: BanBlogModel, res: Response): Promise<Response<any, Record<string, any>>>;
}
