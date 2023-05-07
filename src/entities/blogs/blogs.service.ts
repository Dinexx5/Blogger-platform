import { BlogsRepository } from './blogs.repository';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { BlogViewModel, createBlogModel, updateBlogModel } from './blogs.models';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/domain/user.entity';
import { Repository } from 'typeorm';
import { Blog } from './domain/blog.entity';
import { UserBanInfo } from '../users/domain/banInfo.entity';
import { BlogBansInfo } from './domain/blogBansInfo.entity';
import { BlogOwnerInfo } from './domain/blogOwner.entity';

@Injectable()
export class BlogsService {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected usersRepository: UsersRepository,
    @InjectRepository(Blog)
    private readonly blogsTypeOrmRepository: Repository<Blog>,
    @InjectRepository(BlogBansInfo)
    private readonly blogBanInfoRepository: Repository<BlogBansInfo>,
    @InjectRepository(BlogOwnerInfo)
    private readonly blogOwnerInfoRepository: Repository<BlogOwnerInfo>,
  ) {}

  async createBlog(inputModel: createBlogModel, userId: number): Promise<BlogViewModel> {
    const user = await this.usersRepository.findUserById(userId);
    const isMembership = false;
    const createdAt = new Date().toISOString();
    const blog = await this.blogsTypeOrmRepository.create();
    blog.name = inputModel.name;
    blog.description = inputModel.description;
    blog.websiteUrl = inputModel.websiteUrl;
    blog.isMembership = isMembership;
    blog.createdAt = createdAt;
    await this.blogsTypeOrmRepository.save(blog);
    const blogBanInfo = await this.blogBanInfoRepository.create();
    blogBanInfo.blogId = blog.id;
    blogBanInfo.isBanned = false;
    blogBanInfo.banDate = null;
    await this.blogBanInfoRepository.save(blogBanInfo);
    const blogOwnerInfo = await this.blogOwnerInfoRepository.create();
    blogOwnerInfo.blogId = blog.id;
    blogOwnerInfo.userId = userId;
    blogOwnerInfo.userLogin = user.login;
    await this.blogOwnerInfoRepository.save(blogOwnerInfo);

    return {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: blog.isMembership,
      createdAt: blog.createdAt,
      id: blog.id.toString(),
    };
  }
  async deleteBlogById(blogId: number, userId: number) {
    const blog = await this.blogsRepository.findBlogById(blogId);
    if (!blog) throw new NotFoundException();
    const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
    if (blogOwnerInfo.userId !== userId) throw new ForbiddenException();
    await this.blogOwnerInfoRepository.remove(blogOwnerInfo);
    await this.blogBanInfoRepository.delete({ blogId: blogId });
    await this.blogsTypeOrmRepository.remove(blog);
  }

  async UpdateBlogById(blogBody: updateBlogModel, blogId: number, userId: number) {
    const { name, description, websiteUrl } = blogBody;
    const blog = await this.blogsRepository.findBlogById(blogId);
    const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
    if (!blog) throw new NotFoundException();
    if (blogOwnerInfo.userId !== userId) throw new ForbiddenException();
    blog.name = name;
    blog.description = description;
    blog.websiteUrl = websiteUrl;
    await this.blogsTypeOrmRepository.save(blog);
  }
}
