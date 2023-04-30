import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async createBlog(
    name: string,
    description: string,
    websiteUrl: string,
    isMembership: boolean,
    createdAt: string,
    userId: string,
    login: string,
  ) {
    const blogQuery = `INSERT INTO "Blogs"
                   (name, description, "isMembership", "websiteUrl", "createdAt")
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING *;`;

    const banInfoQuery = `INSERT INTO "BlogBansInfo"
                   ("blogId", "isBanned", "banDate")
                   VALUES ($1, $2, $3)
                   RETURNING *;`;
    const blogOwnerQuery = `INSERT INTO "BlogOwnerInfo"
                   ("blogId", "userId", "userLogin")
                   VALUES ($1, $2, $3)
                   RETURNING *;`;

    const result = await this.dataSource.query(blogQuery, [
      name,
      description,
      isMembership,
      websiteUrl,
      createdAt,
    ]);
    await this.dataSource.query(banInfoQuery, [result[0].id, false, null]);
    await this.dataSource.query(blogOwnerQuery, [result[0].id, userId, login]);

    return result[0];
  }
  async findBlogInstance(blogId: string) {
    const blog = await this.dataSource.query(
      `
          SELECT *
          FROM "Blogs"
          WHERE "id" = $1
      `,
      [blogId],
    );
    return blog[0];
  }
  async findBlogOwnerInfo(blogId: string) {
    const blogOwnerInfo = await this.dataSource.query(
      `
          SELECT *
          FROM "BlogOwnerInfo"
          WHERE "blogId" = $1
      `,
      [blogId],
    );
    return blogOwnerInfo[0];
  }
  async updateBlog(blogId: string, name: string, description: string, websiteUrl: string) {
    await this.dataSource.query(
      `
          UPDATE "Blogs"
          SET "name"= '${name}', "description"= '${description}', "websiteUrl"= '${websiteUrl}'
          WHERE "id" = $1
      `,
      [blogId],
    );
  }
  async updateBanInfoForBan(blogId: string, banDate: string) {
    await this.dataSource.query(
      `
          UPDATE "BlogBansInfo"
          SET "isBanned"= true, "banDate"= '${banDate}'
          WHERE "blogId" = $1
      `,
      [blogId],
    );
  }
  async updateBanInfoForUnban(blogId: string) {
    await this.dataSource.query(
      `
          UPDATE "BlogBansInfo"
          SET "isBanned"= false, "banDate"= null
          WHERE "blogId" = $1
      `,
      [blogId],
    );
  }
  async bindBlogWithUser(blogId: string, userId: string, login: string) {
    await this.dataSource.query(
      `
          UPDATE "BlogOwnerInfo"
          SET "userId"= $2, "userLogin"= $3
          WHERE "blogId" = $1
      `,
      [blogId, userId, login],
    );
  }
  async deleteBlog(blogId: string) {
    await this.dataSource.query(
      `
          DELETE
          FROM "BlogOwnerInfo"
          WHERE "blogId" = $1
      `,
      [blogId],
    );
    await this.dataSource.query(
      `
          DELETE
          FROM "BlogBansInfo"
          WHERE "blogId" = $1
      `,
      [blogId],
    );
    await this.dataSource.query(
      `
          DELETE
          FROM "Blogs"
          WHERE "id" = $1
      `,
      [blogId],
    );
  }

  async findBlogsForUser(userId: string) {
    const blogsForUser = await this.dataSource.query(
      `
          SELECT "blogId"
          FROM "BlogOwnerInfo"
          WHERE "userId" = $1
      `,
      [userId],
    );
    const blogsIds = blogsForUser.map((blog) => blog.blogId.toString());
    return blogsIds;
  }
}
