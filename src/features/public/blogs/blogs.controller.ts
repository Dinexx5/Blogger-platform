import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsQueryRepository } from './blogs.query-repo';
import { PostsQueryRepository } from '../posts/posts.query-repo';
import { GetUserGuard } from '../../auth/guards/getuser.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { blogParamModel, BlogViewModel } from './blogs.models';
import { isBlogIdIntegerGuard } from '../../auth/guards/param.blogId.integer.guard';
import { PostViewModel } from '../posts/posts.models';
import { paginatedViewModel } from '../../../shared/models/pagination';
import { JwtAccessAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { SubscribeToBlogCommand } from '../../integrations/application/use-cases/subsrcibe-to-blog.use-case';
import { UnsubscribeFromBlogCommand } from '../../integrations/application/use-cases/unsubscribe-from-blog.use-case';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async getBlogs(@Query() paginationQuery): Promise<paginatedViewModel<BlogViewModel[]>> {
    const returnedBlogs = await this.blogsQueryRepository.getAllBlogs(paginationQuery);
    return returnedBlogs;
  }

  @UseGuards(isBlogIdIntegerGuard)
  @Get(':blogId')
  async getBlog(@Param() params: blogParamModel): Promise<BlogViewModel> {
    return await this.blogsQueryRepository.findBlogById(params.blogId);
  }

  @UseGuards(GetUserGuard, isBlogIdIntegerGuard)
  @Get(':blogId/posts')
  async getPosts(
    @CurrentUser() userId,
    @Param() params: blogParamModel,
    @Query() paginationQuery,
  ): Promise<paginatedViewModel<PostViewModel[]>> {
    await this.blogsQueryRepository.findBlogById(params.blogId);
    return await this.postsQueryRepository.getAllPosts(paginationQuery, params.blogId, userId);
  }

  @UseGuards(JwtAccessAuthGuard, isBlogIdIntegerGuard)
  @Post(':blogId/subscription')
  @HttpCode(HttpStatus.NO_CONTENT)
  async subscribeToBlog(@CurrentUser() userId, @Param() params: blogParamModel) {
    await this.commandBus.execute(new SubscribeToBlogCommand(params.blogId, userId));
  }

  @UseGuards(JwtAccessAuthGuard, isBlogIdIntegerGuard)
  @Delete(':blogId/subscription')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unsubscribeFromBlog(@CurrentUser() userId, @Param() params: blogParamModel) {
    await this.commandBus.execute(new UnsubscribeFromBlogCommand(params.blogId, userId));
  }
}
