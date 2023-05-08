import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BannedForBlogUserViewModel } from '../users/userModels';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../blogs/blogs.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogOwnerInfo } from '../blogs/domain/blogOwner.entity';
import { UserBanForBlog } from './domain/userBanForBlog.entity';

export class BloggerBansQueryRepository {
  constructor(
    protected blogsRepository: BlogsRepository,
    @InjectRepository(BlogOwnerInfo)
    private readonly blogOwnerInfoRepository: Repository<BlogOwnerInfo>,
    @InjectRepository(UserBanForBlog)
    private readonly userBansTypeOrmRepository: Repository<UserBanForBlog>,
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
    blogId: number,
    userId: number,
  ): Promise<paginatedViewModel<BannedForBlogUserViewModel[]>> {
    const {
      sortDirection = 'desc',
      sortBy = 'login',
      pageNumber = 1,
      pageSize = 10,
      searchLoginTerm = null,
    } = query;
    const skippedBlogsCount = (+pageNumber - 1) * +pageSize;
    const sortDirectionSql: 'ASC' | 'DESC' = sortDirection === 'desc' ? 'DESC' : 'ASC';

    const blog = await this.blogsRepository.findBlogById(blogId);
    if (!blog) throw new NotFoundException();
    const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
    if (blogOwnerInfo.userId !== userId) throw new ForbiddenException();

    const subQuery = `ub.blogId = :blogId AND ${
      searchLoginTerm ? 'LOWER(ub.login) LIKE LOWER(:searchLoginTerm)' : 'true'
    }`;
    const orderQuery = `CASE WHEN "${sortBy}" = LOWER("${sortBy}") THEN 2
         ELSE 1 END, "${sortBy}"`;
    const builder = this.userBansTypeOrmRepository
      .createQueryBuilder('ub')
      .where(subQuery, { blogId: blogId, searchLoginTerm: `%${searchLoginTerm}%` });
    const bans = await builder
      .orderBy(orderQuery, sortDirectionSql)
      .limit(+pageSize)
      .offset(skippedBlogsCount)
      .getMany();
    const count = await builder.getCount();
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
