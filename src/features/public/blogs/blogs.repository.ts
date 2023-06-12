import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BlogEntity } from '../../blogger/domain/blog.entity';
import { BlogOwnerInfoEntity } from '../../blogger/domain/blog-owner-info.entity';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogsTypeOrmRepository: Repository<BlogEntity>,
    @InjectRepository(BlogOwnerInfoEntity)
    private readonly blogOwnerInfoTypeOrmRepository: Repository<BlogOwnerInfoEntity>,
  ) {}

  async findBlogById(blogId: number) {
    return await this.blogsTypeOrmRepository.findOneBy({ id: blogId });
  }
  async findBlogsForUser(userId: number) {
    const blogs = await this.blogOwnerInfoTypeOrmRepository.findBy({ userId: userId });
    return blogs.map((blog) => blog.blogId);
  }
}
