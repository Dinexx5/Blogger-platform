import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
  ) {
    const postQuery = `INSERT INTO "Posts"
                   (title, "shortDescription", content, "blogId", "blogName", "createdAt")
                   VALUES ($1, $2, $3, $4, $5, $6)
                   RETURNING *;`;

    const result = await this.dataSource.query(postQuery, [
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      createdAt,
    ]);
    return result[0];
  }
  async findPostInstance(postId: string) {
    const post = await this.dataSource.query(
      `
          SELECT *
          FROM "Posts"
          WHERE "id" = $1
      `,
      [postId],
    );
    return post[0];
  }
  async deletePost(postId: string) {
    await this.dataSource.query(
      `
          DELETE
          FROM "NewestLikes"
          WHERE "postId" = $1
      `,
      [postId],
    );
    await this.dataSource.query(
      `
          DELETE
          FROM "ExtendedLikesInfo"
          WHERE "postId" = $1
      `,
      [postId],
    );
    await this.dataSource.query(
      `
          DELETE
          FROM "Posts"
          WHERE "id" = $1
      `,
      [postId],
    );
  }
  async updatePost(
    postId: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ) {
    await this.dataSource.query(
      `
          UPDATE "Posts"
          SET "title"= '${title}', "shortDescription"= '${shortDescription}',
           "content"= '${content}', "blogId"= '${blogId}'
          WHERE "id" = $1
      `,
      [postId],
    );
  }
  async findPostsForUser(blogs: string[]) {
    if (blogs.length === 0) return [];
    const bannedBlogsStrings = blogs.join();
    const posts = await this.dataSource.query(
      `
          SELECT *
          FROM "Posts"
          WHERE "blogId" IN ($1)
      `,
      [bannedBlogsStrings],
    );
    return posts.map((post) => post.id.toString());
  }
  async findPostsToGetComments(blogs: string[]) {
    if (blogs.length === 0) return [];
    const posts = await this.dataSource.query(
      `
          SELECT *
          FROM "Posts"
          WHERE "blogId" IN (${blogs})
      `,
    );
    return posts.map((post) => post.id.toString());
  }
}
