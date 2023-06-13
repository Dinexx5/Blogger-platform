import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBanForBlogEntity } from '../blogger/domain/user-ban-for-blog.entity';

@Injectable()
export class UsersBansForBlogRepository {
  constructor(
    @InjectRepository(UserBanForBlogEntity)
    private readonly usersBansForBlogsRepository: Repository<UserBanForBlogEntity>,
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
