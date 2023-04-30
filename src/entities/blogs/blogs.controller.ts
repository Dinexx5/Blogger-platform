import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { BlogsQueryRepository } from './blogs.query-repo';
import { PostsQueryRepository } from '../posts/posts.query-repo';
import { paginatedViewModel } from '../../shared/models/pagination';
import { Response } from 'express';
import { GetUserGuard } from '../auth/guards/getuser.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { BlogViewModel } from './blogs.models';
import { isBlogIdIntegerGuard } from '../auth/guards/param.blogId.integer.guard';
import { PostViewModel } from '../posts/posts.models';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getBlogs(@Query() paginationQuery) {
    const returnedBlogs: paginatedViewModel<BlogViewModel[]> =
      await this.blogsQueryRepository.getAllBlogs(paginationQuery);
    return returnedBlogs;
  }
  @UseGuards(isBlogIdIntegerGuard)
  @Get(':blogId')
  async getBlog(@Param('blogId') id: string, @Res() res: Response) {
    const blog: BlogViewModel | null = await this.blogsQueryRepository.findBlogById(id);
    if (!blog) {
      return res.sendStatus(404);
    }
    return res.send(blog);
  }
  @UseGuards(GetUserGuard, isBlogIdIntegerGuard)
  @Get(':blogId/posts')
  async getPosts(
    @CurrentUser() userId,
    @Param('blogId') blogId: string,
    @Query() paginationQuery,
    @Res() res: Response,
  ) {
    const blog = await this.blogsQueryRepository.findBlogById(blogId);
    if (!blog) return res.sendStatus(404);
    const returnedPosts: paginatedViewModel<PostViewModel[]> =
      await this.postsQueryRepository.getAllPosts(paginationQuery, blogId, userId);
    return res.send(returnedPosts);
  }
}
