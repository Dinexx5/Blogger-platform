import { paginatedViewModel, paginationQuerysSA } from '../../shared/models/pagination';
import { SaUserViewModel, SaUserFromSqlRepo } from './userModels';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

export class SaUsersQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async getAllUsers(query: paginationQuerysSA): Promise<paginatedViewModel<SaUserViewModel[]>> {
    const {
      sortDirection = 'desc',
      sortBy = 'createdAt',
      pageNumber = 1,
      pageSize = 10,
      searchLoginTerm = null,
      searchEmailTerm = null,
      banStatus = 'all',
    } = query;

    const skippedUsersCount = (+pageNumber - 1) * +pageSize;

    const subQuery = `(${
      banStatus && banStatus !== 'all'
        ? `
          ${banStatus === 'banned' ? `"isBanned" IS TRUE` : `"isBanned" IS FALSE`}
          `
        : '"isBanned" IS TRUE OR "isBanned" IS FALSE'
    }) AND (${
      searchLoginTerm && !searchEmailTerm
        ? `LOWER("login") LIKE '%' || LOWER('${searchLoginTerm}') || '%'`
        : !searchLoginTerm && searchEmailTerm
        ? `LOWER("email") LIKE '%' || LOWER('${searchEmailTerm}') || '%'`
        : searchLoginTerm && searchEmailTerm
        ? `LOWER("login") LIKE '%' || LOWER('${searchLoginTerm}') || '%' 
                          OR  LOWER("email") LIKE '%' || LOWER('${searchEmailTerm}') || '%'`
        : true
    })`;

    const selectQuery = `SELECT u.*, b."isBanned",b."banDate",b."banReason",
                                CASE
                                 WHEN "${sortBy}" = LOWER("${sortBy}") THEN 2
                                 ELSE 1
                                END toOrder
                    FROM "Users" u
                    LEFT JOIN "BanInfo" b
                    ON u."id" = b."userId"
                    WHERE ${subQuery}
                    ORDER BY toOrder,
                      CASE when $1 = 'desc' then "${sortBy}" END DESC,
                      CASE when $1 = 'asc' then "${sortBy}" END ASC
                    LIMIT $2
                    OFFSET $3
                    `;
    const counterQuery = `SELECT COUNT(*)
                    FROM "Users" u
                    LEFT JOIN "BanInfo" b
                    ON u."id" = b."userId"
                    WHERE ${subQuery}`;
    const counter = await this.dataSource.query(counterQuery);
    const count = counter[0].count;
    const users = await this.dataSource.query(selectQuery, [
      sortDirection,
      pageSize,
      skippedUsersCount,
    ]);
    const usersView = users.map(this.mapDbUserToUserViewModel);
    return {
      pagesCount: Math.ceil(+count / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +count,
      items: usersView,
    };
  }
  mapDbUserToUserViewModel(user: SaUserFromSqlRepo): SaUserViewModel {
    return {
      id: user.id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
      banInfo: {
        isBanned: user.isBanned,
        banDate: user.banDate,
        banReason: user.banReason,
      },
    };
  }
}
