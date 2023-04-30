import { BlogsRepository } from './blogs.repository';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { BlogViewModel, createBlogModel, updateBlogModel } from './blogs.models';

@Injectable()
export class BlogsService {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected usersRepository: UsersRepository,
  ) {}

  async createBlog(inputModel: createBlogModel, userId: string): Promise<BlogViewModel> {
    const user = await this.usersRepository.findUserById(userId);
    const isMembership = false;
    const createdAt = new Date().toISOString();
    const createdBlog = await this.blogsRepository.createBlog(
      inputModel.name,
      inputModel.description,
      inputModel.websiteUrl,
      isMembership,
      createdAt,
      user.id.toString(),
      user.login,
    );
    return {
      name: createdBlog.name,
      description: createdBlog.description,
      websiteUrl: createdBlog.websiteUrl,
      isMembership: createdBlog.isMembership,
      createdAt: createdBlog.createdAt,
      id: createdBlog.id.toString(),
    };
  }
  async deleteBlogById(blogId: string, userId: string) {
    const blog = await this.blogsRepository.findBlogInstance(blogId);
    if (!blog) throw new NotFoundException();
    const blogOwnerInfo = await this.blogsRepository.findBlogOwnerInfo(blogId);
    if (blogOwnerInfo.userId.toString() !== userId) throw new ForbiddenException();
    await this.blogsRepository.deleteBlog(blogId);
  }

  async UpdateBlogById(blogBody: updateBlogModel, blogId: string, userId: string) {
    const { name, description, websiteUrl } = blogBody;
    const blog = await this.blogsRepository.findBlogInstance(blogId);
    const blogOwnerInfo = await this.blogsRepository.findBlogOwnerInfo(blogId);
    if (!blog) throw new NotFoundException();
    if (blogOwnerInfo.userId.toString() !== userId) throw new ForbiddenException();
    await this.blogsRepository.updateBlog(blogId, name, description, websiteUrl);
  }
}
