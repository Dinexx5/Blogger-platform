import { paginatedViewModel, paginationQuerysSA } from '../../shared/models/pagination';
import { SaUserViewModel } from './userModels';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './domain/user.entity';

export class SaUsersQueryRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersTypeOrmRepository: Repository<User>,
  ) {}
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
    const sortDirectionSql: 'ASC' | 'DESC' = sortDirection === 'desc' ? 'DESC' : 'ASC';

    const bannedSubQuery = `${
      banStatus && banStatus !== 'all'
        ? `
          ${banStatus === 'banned' ? `bi."isBanned" = true` : `bi."isBanned" = false`}
      `
        : `"isBanned" = true OR "isBanned" = false`
    }`;

    const searchTermQuery = `(${
      searchLoginTerm && !searchEmailTerm
        ? `LOWER(u.login) LIKE LOWER(:searchLoginTerm)`
        : !searchLoginTerm && searchEmailTerm
        ? `LOWER(u.email) LIKE LOWER(:searchEmailTerm)`
        : searchLoginTerm && searchEmailTerm
        ? `LOWER(u.login) LIKE LOWER(:searchLoginTerm) 
                          OR  LOWER(u.email) LIKE LOWER(:searchEmailTerm)`
        : true
    })`;
    const orderQuery = `CASE WHEN "${sortBy}" = LOWER("${sortBy}") THEN 2
         ELSE 1 END, "${sortBy}"`;

    const builder = this.usersTypeOrmRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.banInfo', 'bi')
      .where(bannedSubQuery)
      .andWhere(searchTermQuery, {
        searchEmailTerm: `%${searchEmailTerm}%`,
        searchLoginTerm: `%${searchLoginTerm}%`,
      });

    const users = await builder
      .orderBy(orderQuery, sortDirectionSql)
      .limit(+pageSize)
      .offset(skippedUsersCount)
      .getMany();
    const count = await builder.getCount();
    const usersView = users.map(this.mapDbUserToUserViewModel);
    return {
      pagesCount: Math.ceil(+count / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +count,
      items: usersView,
    };
  }
  mapDbUserToUserViewModel(user): SaUserViewModel {
    return {
      id: user.id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
      banInfo: {
        isBanned: user.banInfo.isBanned,
        banDate: user.banInfo.banDate,
        banReason: user.banInfo.banReason,
      },
    };
  }
}
