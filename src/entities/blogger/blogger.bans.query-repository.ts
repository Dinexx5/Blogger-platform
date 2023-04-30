import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BannedForBlogUserViewModel } from '../users/userModels';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../blogs/blogs.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class BloggerBansQueryRepository {
  constructor(
    protected blogsRepository: BlogsRepository,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  mapFoundBansToViewModel(ban): BannedForBlogUserViewModel {
    return {
      id: ban.userId.toString(),
      login: ban.login,
      banInfo: {
        isBanned: ban.isBanned,
        banDate: ban.banDate,
        banReason: ban.banReason,
      },
    };
  }
  async getAllBannedUsersForBlog(
    query: paginationQuerys,
    blogId: string,
    userId: string,
  ): Promise<paginatedViewModel<BannedForBlogUserViewModel[]>> {
    const {
      sortDirection = 'desc',
      sortBy = 'login',
      pageNumber = 1,
      pageSize = 10,
      searchLoginTerm = null,
    } = query;
    const skippedBlogsCount = (+pageNumber - 1) * +pageSize;

    const blog = await this.blogsRepository.findBlogInstance(blogId);
    if (!blog) throw new NotFoundException();
    const blogOwnerInfo = await this.blogsRepository.findBlogOwnerInfo(blogId);
    if (blogOwnerInfo.userId.toString() !== userId) throw new ForbiddenException();

    const subQuery = `"blogId" = ${blogId} AND (${
      searchLoginTerm ? `LOWER("login") LIKE '%' || LOWER('${searchLoginTerm}') || '%'` : true
    })`;
    const selectQuery = `SELECT "userId", "login", "isBanned","banDate","banReason",
                                CASE
                                 WHEN "${sortBy}" = LOWER("${sortBy}") THEN 2
                                 ELSE 1
                                END toOrder
                    FROM "UserBanForBlog"
                    WHERE ${subQuery}
                    ORDER BY toOrder,
                      CASE when $1 = 'desc' then "${sortBy}" END DESC,
                      CASE when $1 = 'asc' then "${sortBy}" END ASC
                    LIMIT $2
                    OFFSET $3
                    `;
    const counterQuery = `SELECT COUNT(*)
                    FROM "UserBanForBlog" u
                    WHERE ${subQuery}`;

    const counter = await this.dataSource.query(counterQuery);
    const count = counter[0].count;
    const bans = await this.dataSource.query(selectQuery, [
      sortDirection,
      pageSize,
      skippedBlogsCount,
    ]);
    const bansView = bans.map(this.mapFoundBansToViewModel);
    return {
      pagesCount: Math.ceil(+count / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +count,
      items: bansView,
    };
  }
}
