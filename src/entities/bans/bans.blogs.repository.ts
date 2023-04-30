import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogBansRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async createBan(blogId: string, isBanned: boolean, bannedPostsIds: string[]) {
    const banQuery = `INSERT INTO "BlogBans"
                   ("blogId", "isBanned", "bannedPostsIds")
                   VALUES ($1, $2, $3)
                   RETURNING *;`;
    await this.dataSource.query(banQuery, [blogId, isBanned, bannedPostsIds]);
  }
  async unbanBlog(blogId: string) {
    await this.dataSource.query(
      `
          DELETE
          FROM "BlogBans"
          WHERE "blogId" = $1
      `,
      [blogId],
    );
  }
  async findBanByBlogId(blogId: string) {
    const ban = await this.dataSource.query(
      `
          SELECT *
          FROM "BlogBans"
          WHERE "blogId" = $1
      `,
      [blogId],
    );
    return ban[0];
  }
  async countBannedBlogs() {
    const counterQuery = `SELECT COUNT(*)
                    FROM "BlogBans" `;
    const counter = await this.dataSource.query(counterQuery);
    return counter[0].count;
  }
  async getBannedBlogs() {
    const bannedUsersCount = await this.countBannedBlogs();
    if (!bannedUsersCount) return [];
    const allBans = await this.dataSource.query(`SELECT * FROM "BlogBans"`);
    const bannedBlogs = [];
    allBans.forEach((ban) => {
      bannedBlogs.push(ban.blogId);
    });
    return bannedBlogs;
  }
  async getBannedPosts() {
    const bannedUsersCount = await this.countBannedBlogs();
    if (!bannedUsersCount) return [];
    const allBans = await this.dataSource.query(`SELECT * FROM "BlogBans"`);
    const bannedPosts = [];
    allBans.forEach((ban) => {
      bannedPosts.push(...ban.bannedPostsIds);
    });
    return bannedPosts;
  }
}
