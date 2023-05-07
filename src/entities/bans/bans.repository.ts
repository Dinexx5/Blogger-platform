import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { createBanModel } from './bans.models';
import { SaUserBan } from './domain/saUserBan.entity';

@Injectable()
export class BansRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(SaUserBan)
    private readonly banTypeOrmRepository: Repository<SaUserBan>,
  ) {}

  async isUserBanned(userId: number) {
    const ban = await this.banTypeOrmRepository.findOneBy({ userId: userId });
    if (ban) return true;
    return false;
  }
  async countBannedUsers() {
    return await this.banTypeOrmRepository.count({});
  }
  async getBannedUsers() {
    const allBans = await this.banTypeOrmRepository.find({});
    const bannedUsers = [];
    allBans.forEach((ban) => {
      bannedUsers.push(ban.userId);
    });
    return bannedUsers;
  }
  async getBannedBlogs() {
    const bannedUsersCount = await this.countBannedUsers();
    if (!bannedUsersCount) return [];
    const allBans = await this.banTypeOrmRepository.find({});
    const bannedBlogs = [];
    allBans.forEach((ban) => {
      bannedBlogs.push(...ban.bannedBlogsIds);
    });
    return bannedBlogs;
  }
  async getBannedPosts() {
    const bannedUsersCount = await this.countBannedUsers();
    if (!bannedUsersCount) return [];
    const allBans = await this.banTypeOrmRepository.find({});
    const bannedPosts = [];
    allBans.forEach((ban) => {
      bannedPosts.push(...ban.bannedPostsIds);
    });
    return bannedPosts;
  }
  async getBannedComments() {
    const bannedUsersCount = await this.countBannedUsers();
    if (!bannedUsersCount) return [];
    const allBans = await this.banTypeOrmRepository.find({});
    const bannedComments = [];
    allBans.forEach((ban) => {
      bannedComments.push(...ban.bannedCommentsIds);
    });
    return bannedComments;
  }
}
