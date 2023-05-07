import { Injectable } from '@nestjs/common';
import { BansRepository } from '../bans/bans.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsLikesRepository {
  constructor(
    protected bansRepository: BansRepository,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  async findLikesForPost(postId: string) {
    const bannedUsers = await this.bansRepository.getBannedUsers();
    const query = `
          SELECT *
          FROM "PostsLikes"
          WHERE "postId" = $1 AND "userId" ${
            bannedUsers.length ? `NOT IN (${bannedUsers})` : `IS NOT NULL`
          }
      `;
    const likes = await this.dataSource.query(query, [postId]);
    return likes;
  }
  async findThreeLatestLikes(postId: string) {
    const bannedUsers = await this.bansRepository.getBannedUsers();
    const allLikes = await this.dataSource.query(
      `
          SELECT *
          FROM "PostsLikes"
          WHERE "postId" = $1 AND "userId" ${
            bannedUsers.length ? `NOT IN (${bannedUsers})` : `IS NOT NULL`
          } AND "likeStatus" = 'Like'
          ORDER BY "createdAt" DESC
      `,
      [postId],
    );
    const threeLatestLikes = allLikes.slice(0, 3);
    const mappedThreeLatestLikes = threeLatestLikes.map((like) => {
      return {
        addedAt: like.createdAt,
        userId: like.userId.toString(),
        login: like.login,
      };
    });
    return mappedThreeLatestLikes;
  }
}
