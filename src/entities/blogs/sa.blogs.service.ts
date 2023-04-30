import { BlogsRepository } from './blogs.repository';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class SuperAdminBlogsService {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected usersRepository: UsersRepository,
  ) {}
  async bindBlog(blogId: string, userId: string) {
    const user = await this.usersRepository.findUserById(userId);
    await this.blogsRepository.bindBlogWithUser(blogId, userId, user.login);
  }
}
