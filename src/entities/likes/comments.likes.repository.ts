import { Injectable } from '@nestjs/common';
import { BansRepository } from '../bans/bans.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsLikesRepository {
  constructor(
    protected bansRepository: BansRepository,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  async likeComment(commentId: string, likeStatus: string, userId: string, createdAt: string) {
    const likeQuery = `INSERT INTO "CommentsLikes"
                   ("commentId", "likeStatus", "userId", "createdAt")
                   VALUES ($1, $2, $3, $4)
                   RETURNING *;`;
    await this.dataSource.query(likeQuery, [commentId, likeStatus, userId, createdAt]);
  }
  async findLikeByCommentIdAndUserId(commentId: string, userId: string) {
    const like = await this.dataSource.query(
      `
          SELECT *
          FROM "CommentsLikes"
          WHERE "commentId" = $1 AND "userId" = $2
      `,
      [commentId, userId],
    );
    return like[0];
  }
  async updateLikeStatus(commentId: string, userId: string, likeStatus: string) {
    await this.dataSource.query(
      `
          UPDATE "CommentsLikes"
          SET "likeStatus"= $3
          WHERE "commentId" = $1 AND "userId" = $2
      `,
      [commentId, userId, likeStatus],
    );
  }
  async findLikesForComment(commentId: string) {
    const bannedUsers = await this.bansRepository.getBannedUsers();
    const likes = await this.dataSource.query(
      `
          SELECT *
          FROM "CommentsLikes"
          WHERE "commentId" = $1 AND "userId" ${
            bannedUsers.length ? `NOT IN (${bannedUsers})` : `IS NOT NULL`
          }
      `,
      [commentId],
    );
    return likes;
  }
}
