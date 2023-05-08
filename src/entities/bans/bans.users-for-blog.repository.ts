import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBanForBlog } from '../blogger/domain/userBanForBlog.entity';

@Injectable()
export class UsersBansForBlogRepository {
  constructor(
    @InjectRepository(UserBanForBlog)
    private readonly usersBansForBlogsRepository: Repository<UserBanForBlog>,
  ) {}
  async countBannedUsers() {
    return await this.usersBansForBlogsRepository.count();
  }
  async getBannedPostsForUser(userId: number) {
    const bannedUsersCount = await this.countBannedUsers();
    if (!bannedUsersCount) return [];
    const allBansForUser = await this.usersBansForBlogsRepository.findBy({ userId: userId });
    const forbiddenPosts = [];
    allBansForUser.forEach((ban) => {
      forbiddenPosts.push(...ban.bannedPostsIds);
    });
    return forbiddenPosts;
  }
}
