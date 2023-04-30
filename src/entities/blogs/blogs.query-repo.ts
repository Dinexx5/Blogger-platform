import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BlogViewModel } from './blogs.models';
import { BansRepository } from '../bans/bans.repository';
import { BlogBansRepository } from '../bans/bans.blogs.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class BlogsQueryRepository {
  constructor(
    protected bansRepository: BansRepository,
    protected blogBansRepository: BlogBansRepository,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  mapFoundBlogToBlogViewModel(blog): BlogViewModel {
    return {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: blog.isMembership,
      createdAt: blog.createdAt,
      id: blog.id.toString(),
    };
  }
  async getAllBlogs(
    query: paginationQuerys,
    userId?: string,
  ): Promise<paginatedViewModel<BlogViewModel[]>> {
    const {
      sortDirection = 'desc',
      sortBy = 'createdAt',
      pageNumber = 1,
      pageSize = 10,
      searchNameTerm = null,
    } = query;

    const skippedBlogsCount = (+pageNumber - 1) * +pageSize;

    const bannedBlogsFromUsers = await this.bansRepository.getBannedBlogs();
    const bannedBlogs = await this.blogBansRepository.getBannedBlogs();
    const allBannedBlogs = bannedBlogs.concat(bannedBlogsFromUsers);

    const subQuery = `"id" ${
      allBannedBlogs.length ? `NOT IN (${allBannedBlogs})` : `IS NOT NULL`
    } AND (${
      searchNameTerm && !userId
        ? `LOWER("name") LIKE '%' || LOWER('${searchNameTerm}') || '%'`
        : userId && !searchNameTerm
        ? `"userId" = ${userId}`
        : userId && searchNameTerm
        ? `LOWER("name") LIKE '%' || LOWER('${searchNameTerm}') || '%' AND
         "userId" = ${userId}`
        : true
    })`;

    const selectQuery = `SELECT b.*, o."userId",
                                CASE
                                 WHEN "${sortBy}" = LOWER("${sortBy}") THEN 2
                                 ELSE 1
                                END toOrder
                    FROM "Blogs" b
                    LEFT JOIN "BlogOwnerInfo" o
                    ON b."id" = o."blogId"
                    WHERE ${subQuery}
                    ORDER BY toOrder,
                      CASE when $1 = 'desc' then "${sortBy}" END DESC,
                      CASE when $1 = 'asc' then "${sortBy}" END ASC
                    LIMIT $2
                    OFFSET $3
                    `;
    const counterQuery = `SELECT COUNT(*)
                    FROM "Blogs" b
                    LEFT JOIN "BlogOwnerInfo" o
                    ON b."id" = o."blogId"
                    WHERE ${subQuery}`;

    const counter = await this.dataSource.query(counterQuery);
    const count = counter[0].count;
    const blogs = await this.dataSource.query(selectQuery, [
      sortDirection,
      pageSize,
      skippedBlogsCount,
    ]);

    const blogsView = blogs.map(this.mapFoundBlogToBlogViewModel);
    return {
      pagesCount: Math.ceil(+count / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +count,
      items: blogsView,
    };
  }

  async findBlogById(blogId: string): Promise<BlogViewModel | null> {
    const bannedBlogsFromUsers = await this.bansRepository.getBannedBlogs();
    const bannedBlogs = await this.blogBansRepository.getBannedBlogs();
    const allBannedBlogs = bannedBlogs.concat(bannedBlogsFromUsers);
    const foundBlog = await this.dataSource.query(
      `
          SELECT *
          FROM "Blogs"
          WHERE "id" = $1
      `,
      [blogId],
    );
    if (!foundBlog.length) return null;
    if (allBannedBlogs.includes(foundBlog[0].id.toString())) return null;
    return this.mapFoundBlogToBlogViewModel(foundBlog[0]);
  }
}
