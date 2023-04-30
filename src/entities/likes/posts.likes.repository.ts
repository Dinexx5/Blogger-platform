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
  async likePost(
    postId: string,
    likeStatus: string,
    userId: string,
    login: string,
    createdAt: string,
  ) {
    const likeQuery = `INSERT INTO "PostsLikes"
                   ("postId", "likeStatus", "userId", login, "createdAt")
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING *;`;
    await this.dataSource.query(likeQuery, [postId, likeStatus, userId, login, createdAt]);
  }
  async findLikeByPostIdAndUserId(postId: string, userId: string) {
    const like = await this.dataSource.query(
      `
          SELECT *
          FROM "PostsLikes"
          WHERE "postId" = $1 AND "userId" = $2
      `,
      [postId, userId],
    );
    return like[0];
  }
  async updateLikeStatus(postId: string, userId: string, likeStatus: string) {
    await this.dataSource.query(
      `
          UPDATE "PostsLikes"
          SET "likeStatus"= $3
          WHERE "postId" = $1 AND "userId" = $2
      `,
      [postId, userId, likeStatus],
    );
  }
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
