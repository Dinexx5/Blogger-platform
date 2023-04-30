import { Body, Controller, Get, Param, Put, Query, Res, UseGuards } from '@nestjs/common';
import { paginatedViewModel } from '../../shared/models/pagination';
import { Response } from 'express';
import {
  BanBlogModel,
  blogAndUserParamModel,
  blogParamModel,
  BlogSAViewModel,
} from './blogs.models';
import { SuperAdminBlogsService } from './sa.blogs.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { BlogsSAQueryRepository } from './sa.blog.query-repo';
import { CommandBus } from '@nestjs/cqrs';
import { BanBlogCommand } from './application/use-cases/ban.blog.use-case';

@Controller('sa/blogs')
export class SuperAdminBlogsController {
  constructor(
    private commandBus: CommandBus,
    protected superAdminBlogsQueryRepository: BlogsSAQueryRepository,
    protected superAdminBlogService: SuperAdminBlogsService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getBlogs(@Query() paginationQuery) {
    const returnedBlogs: paginatedViewModel<BlogSAViewModel[]> =
      await this.superAdminBlogsQueryRepository.getAllBlogs(paginationQuery);
    return returnedBlogs;
  }

  @UseGuards(AuthGuard)
  @Put(':blogId/bind-with-user/:userId')
  async bindBlog(@Param() params: blogAndUserParamModel, @Res() res: Response) {
    await this.superAdminBlogService.bindBlog(params.blogId, params.userId);
    return res.sendStatus(204);
  }
  @UseGuards(AuthGuard)
  @Put(':blogId/ban')
  async banBlog(
    @Param() params: blogParamModel,
    @Body() inputModel: BanBlogModel,
    @Res() res: Response,
  ) {
    await this.commandBus.execute(new BanBlogCommand(params.blogId, inputModel));
    return res.sendStatus(204);
  }
}
