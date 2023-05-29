import { BlogsRepository } from '../../public/blogs/blogs.repository';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentLike } from '../../likes/domain/comment-like.entity';
import { Repository } from 'typeorm';
import { Blog } from '../../public/blogs/domain/blog.entity';
import { BlogOwnerInfo } from '../../public/blogs/domain/blog-owner-info.entity';

@Injectable()
export class SuperAdminBlogsService {
  constructor(
    @InjectRepository(BlogOwnerInfo)
    private readonly blogOwnerInfoRepository: Repository<BlogOwnerInfo>,
    protected usersRepository: UsersRepository,
  ) {}
  async bindBlog(blogId: number, userId: number) {
    const user = await this.usersRepository.findUserById(userId);
    const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
    blogOwnerInfo.userId = userId;
    blogOwnerInfo.userLogin = user.login;
    await this.blogOwnerInfoRepository.save(blogOwnerInfo);
  }
}
