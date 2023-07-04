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
import { JwtAccessAuthGuard } from '../auth/guards/jwt-auth.guard';
import { blogAndPostParamModel, blogParamModel } from '../public/blogs/blogs.models';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { paginatedViewModel } from '../../shared/models/pagination';
import { BlogsQueryRepository } from '../public/blogs/blogs.query-repo';
import { BloggerCommentsQueryRepository } from './blogger.comments.query-repo';
import { commentsForBloggerViewModel } from '../public/comments/comments.models';
import { isBlogIdIntegerGuard } from '../auth/guards/param.blogId.integer.guard';
import { isPostIdIntegerGuard } from '../auth/guards/param.postId.isinteger.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from './application/use-cases/create-blog-use.case';
import { CreateBlogDto } from './dto/create.blog.dto.to';
import { UpdateBlogCommand } from './application/use-cases/update-blog-use.case';
import { DeleteBlogCommand } from './application/use-cases/delete-blog-use.case';
import { updateBlogDto } from './dto/update-blog-dto';
import { CreatePostDto } from './dto/create-post-dto';
import { CreatePostCommand } from './application/use-cases/create-post-use.case';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdatePostCommand } from './application/use-cases/update-post-use.case';
import { DeletePostCommand } from './application/use-cases/delete-post-use.case';

@Controller('blogger/blogs')
export class BloggerController {
  constructor(
    protected blogsQueryRepo: BlogsQueryRepository,
    protected bloggerCommentsQueryRepo: BloggerCommentsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @UseGuards(JwtAccessAuthGuard)
  @Post()
  async createBlog(@Body() inputModel: CreateBlogDto, @CurrentUser() userId) {
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
    @Body() inputModel: CreatePostDto,
    @Param() params: blogParamModel,
    @CurrentUser() userId,
  ) {
    return await this.commandBus.execute(new CreatePostCommand(inputModel, params.blogId, userId));
  }

  @UseGuards(JwtAccessAuthGuard, isBlogIdIntegerGuard, isPostIdIntegerGuard)
  @Put(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Body() inputModel: UpdatePostDto,
    @Param() params: blogAndPostParamModel,
    @CurrentUser() userId,
  ) {
    await this.commandBus.execute(
      new UpdatePostCommand(inputModel, params.postId, params.blogId, userId),
    );
  }

  @UseGuards(JwtAccessAuthGuard, isBlogIdIntegerGuard, isPostIdIntegerGuard)
  @Delete(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param() params: blogAndPostParamModel,
    @Res() res: Response,
    @CurrentUser() userId,
  ) {
    await this.commandBus.execute(new DeletePostCommand(params.postId, params.blogId, userId));
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get()
  async getBlogs(@Query() paginationQuery, @CurrentUser() userId) {
    const returnedBlogs = await this.blogsQueryRepo.getAllBlogs(paginationQuery, userId);
    return returnedBlogs;
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('/comments')
  async getComments(@Query() paginationQuery, @CurrentUser() userId) {
    const returnedComments: paginatedViewModel<commentsForBloggerViewModel[]> =
      await this.bloggerCommentsQueryRepo.getAllComments(paginationQuery, userId);
    return returnedComments;
  }
}
