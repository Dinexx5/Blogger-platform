import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { PostsService } from '../public/posts/posts.service';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-auth.guard';
import { blogAndPostParamModel, blogParamModel, BlogViewModel } from '../public/blogs/blogs.models';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { paginatedViewModel } from '../../shared/models/pagination';
import { BlogsQueryRepository } from '../public/blogs/blogs.query-repo';
import { BloggerCommentsQueryRepository } from './blogger.comments.query-repo';
import { commentsForBloggerViewModel } from '../public/comments/comments.models';
import { isBlogIdIntegerGuard } from '../auth/guards/param.blogId.integer.guard';
import { isPostIdIntegerGuard } from '../auth/guards/param.postId.isinteger.guard';
import { createPostModel, updatePostModel } from '../public/posts/posts.models';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from './application/use-cases/create-blog-use.case';
import { createBlogDto } from './dto/create.blog.dto.to';
import { UpdateBlogCommand } from './application/use-cases/update-blog-use.case';
import { DeleteBlogCommand } from './application/use-cases/delete-blog-use.case';
import { updateBlogDto } from './dto/update-blog-dto';

@Controller('blogger/blogs')
export class BloggerController {
  constructor(
    protected postsService: PostsService,
    protected blogsQueryRepo: BlogsQueryRepository,
    protected bloggerCommentsQueryRepo: BloggerCommentsQueryRepository,
    private commandBus: CommandBus,
  ) {}
  @UseGuards(JwtAccessAuthGuard)
  @Get()
  async getBlogs(@Query() paginationQuery, @CurrentUser() userId) {
    const returnedBlogs: paginatedViewModel<BlogViewModel[]> =
      await this.blogsQueryRepo.getAllBlogs(paginationQuery, userId);
    return returnedBlogs;
  }
  @UseGuards(JwtAccessAuthGuard)
  @Get('/comments')
  async getComments(@Query() paginationQuery, @CurrentUser() userId) {
    const returnedComments: paginatedViewModel<commentsForBloggerViewModel[]> =
      await this.bloggerCommentsQueryRepo.getAllComments(paginationQuery, userId);
    return returnedComments;
  }
  @UseGuards(JwtAccessAuthGuard)
  @Post()
  async createBlog(@Body() inputModel: createBlogDto, @CurrentUser() userId) {
    return await this.commandBus.execute(new CreateBlogCommand(inputModel, userId));
  }
  @UseGuards(JwtAccessAuthGuard, isBlogIdIntegerGuard)
  @Put(':blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Body() inputModel: updateBlogDto,
    @Param() params: blogParamModel,
    @CurrentUser() userId,
  ) {
    await this.commandBus.execute(new UpdateBlogCommand(inputModel, params.blogId, userId));
  }
  @UseGuards(JwtAccessAuthGuard, isBlogIdIntegerGuard)
  @Delete(':blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param() params: blogParamModel, @Res() res: Response, @CurrentUser() userId) {
    await this.commandBus.execute(new DeleteBlogCommand(params.blogId, userId));
  }

  @UseGuards(JwtAccessAuthGuard, isBlogIdIntegerGuard)
  @Post(':blogId/posts')
  async createPost(
    @Body() inputModel: createPostModel,
    @Param() params: blogParamModel,
    @Res() res: Response,
    @CurrentUser() userId,
  ) {
    const post = await this.postsService.createPost(inputModel, params.blogId, userId);
    return res.send(post);
  }
  @UseGuards(JwtAccessAuthGuard, isBlogIdIntegerGuard, isPostIdIntegerGuard)
  @Put(':blogId/posts/:postId')
  async updatePost(
    @Body() inputModel: updatePostModel,
    @Param() params: blogAndPostParamModel,
    @Res() res: Response,
    @CurrentUser() userId,
  ) {
    await this.postsService.updatePostById(inputModel, params.postId, params.blogId, userId);
    return res.sendStatus(204);
  }
  @UseGuards(JwtAccessAuthGuard, isBlogIdIntegerGuard, isPostIdIntegerGuard)
  @Delete(':blogId/posts/:postId')
  async deletePost(
    @Param() params: blogAndPostParamModel,
    @Res() res: Response,
    @CurrentUser() userId,
  ) {
    await this.postsService.deletePostById(+params.postId, +params.blogId, userId);
    return res.sendStatus(204);
  }
}
