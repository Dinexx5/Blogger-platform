import { paginatedViewModel, paginationQuerysSA } from '../../../shared/models/pagination';
import { SaUserViewModel } from './user.models';
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
      .andWhere(searchTermQuery, {
        searchEmailTerm: `%${searchEmailTerm}%`,
        searchLoginTerm: `%${searchLoginTerm}%`,
      });

    if (banStatus && banStatus !== 'all') {
      builder.andWhere('bi.isBanned = :isBanned', {
        isBanned: banStatus === 'banned',
      });
    }
    const [users, totalCount] = await builder
      .orderBy(orderQuery, sortDirection === 'desc' ? 'DESC' : 'ASC')
      .limit(+pageSize)
      .offset((pageNumber - 1) * pageSize)
      .getManyAndCount();

    const usersView = users.map(this.mapDbUserToUserViewModel);
    return {
      pagesCount: Math.ceil(totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
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
