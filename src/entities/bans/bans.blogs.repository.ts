import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SaUserBan } from './domain/saUserBan.entity';
import { SaBlogBan } from './domain/saBlogBan.entity';

@Injectable()
export class BlogBansRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
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
