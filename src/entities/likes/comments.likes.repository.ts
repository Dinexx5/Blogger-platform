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
