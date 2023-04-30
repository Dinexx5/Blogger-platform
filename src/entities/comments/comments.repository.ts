import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async createComment(
    content: string,
    createdAt: string,
    userId: string,
    userLogin: string,
    postId: string,
    title: string,
    blogId: string,
    blogName: string,
  ) {
    const commentQuery = `INSERT INTO "Comments"
                   (content, "createdAt")
                   VALUES ($1, $2)
                   RETURNING *;`;
    const commentatorInfoQuery = `INSERT INTO "CommentatorInfo"
                   ("commentId", "userId", "userLogin")
                   VALUES ($1, $2, $3)
                   RETURNING *;`;
    const postInfoQuery = `INSERT INTO "PostInfoForComment"
                   ("commentId", "postId", title, "blogId", "blogName")
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING *;`;

    const result = await this.dataSource.query(commentQuery, [content, createdAt]);
    await this.dataSource.query(commentatorInfoQuery, [result[0].id, userId, userLogin]);
    await this.dataSource.query(postInfoQuery, [result[0].id, postId, title, blogId, blogName]);
    return result[0];
  }
  async findComment(commentId: string) {
    const comment = await this.dataSource.query(
      `
          SELECT *
          FROM "Comments"
          WHERE "id" = $1
      `,
      [commentId],
    );
    return comment[0];
  }
  async findCommentatorInfo(commentId: string) {
    const comment = await this.dataSource.query(
      `
          SELECT *
          FROM "CommentatorInfo"
          WHERE "commentId" = $1
      `,
      [commentId],
    );
    return comment[0];
  }
  async updateComment(commentId: string, content: string) {
    await this.dataSource.query(
      `
          UPDATE "Comments"
          SET "content"= '${content}'
          WHERE "id" = $1
      `,
      [commentId],
    );
  }
  async deleteComment(commentId: string) {
    await this.dataSource.query(
      `
          DELETE
          FROM "CommentatorInfo"
          WHERE "commentId" = $1
      `,
      [commentId],
    );
    await this.dataSource.query(
      `
          DELETE
          FROM "LikesInfo"
          WHERE "commentId" = $1
      `,
      [commentId],
    );
    await this.dataSource.query(
      `
          DELETE
          FROM "PostInfoForComment"
          WHERE "commentId" = $1
      `,
      [commentId],
    );
    await this.dataSource.query(
      `
          DELETE
          FROM "Comments"
          WHERE "id" = $1
      `,
      [commentId],
    );
  }
  async findBannedComments(userId: string) {
    const commentsForUser = await this.dataSource.query(
      `
          SELECT "commentId"
          FROM "CommentatorInfo"
          WHERE "userId" = $1
      `,
      [userId],
    );
    const commentsIds = commentsForUser.map((comment) => comment.commentId.toString());
    return commentsIds;
  }
}
