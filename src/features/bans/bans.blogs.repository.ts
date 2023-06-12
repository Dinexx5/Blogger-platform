import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaBlogBan } from './domain/saBlogBan.entity';

@Injectable()
export class BlogBansRepository {
  constructor(
    @InjectRepository(SaBlogBan)
    private readonly banTypeOrmRepository: Repository<SaBlogBan>,
  ) {}
  async countBannedBlogs() {
    return await this.banTypeOrmRepository.count({});
  }
  async getBannedBlogs() {
    const bannedUsersCount = await this.countBannedBlogs();
    if (!bannedUsersCount) return [];
    const allBans = await this.banTypeOrmRepository.find({});
    const bannedBlogs = [];
    allBans.forEach((ban) => {
      bannedBlogs.push(ban.blogId);
    });
    return bannedBlogs;
  }
  async getBannedPosts() {
    const bannedUsersCount = await this.countBannedBlogs();
    if (!bannedUsersCount) return [];
    const allBans = await this.banTypeOrmRepository.find({});
    const bannedPosts = [];
    allBans.forEach((ban) => {
      bannedPosts.push(...ban.bannedPostsIds);
    });
    return bannedPosts;
  }
}
