import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Blog } from './domain/blog.entity';
import { BlogOwnerInfo } from './domain/blog-owner-info.entity';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly blogsTypeOrmRepository: Repository<Blog>,
    @InjectRepository(BlogOwnerInfo)
    private readonly blogOwnerInfoTypeOrmRepository: Repository<BlogOwnerInfo>,
  ) {}

  async findBlogById(blogId: number) {
    return await this.blogsTypeOrmRepository.findOneBy({ id: blogId });
  }
  async findBlogsForUser(userId: number) {
    const blogs = await this.blogOwnerInfoTypeOrmRepository.findBy({ userId: userId });
    return blogs.map((blog) => blog.blogId);
  }
}
