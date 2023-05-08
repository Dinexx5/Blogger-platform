import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BannedForBlogUserViewModel } from '../users/userModels';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../blogs/blogs.repository';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BlogOwnerInfo } from '../blogs/domain/blogOwner.entity';
import { UserBanForBlog } from './domain/userBanForBlog.entity';

export class BloggerBansQueryRepository {
  constructor(
    protected blogsRepository: BlogsRepository,
    @InjectDataSource() protected dataSource: DataSource,
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

    const blog = await this.blogsRepository.findBlogById(blogId);
    if (!blog) throw new NotFoundException();
    const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
    if (blogOwnerInfo.userId !== userId) throw new ForbiddenException();

    const builder = this.userBansTypeOrmRepository.createQueryBuilder('ub');

    const subQuery = `ub.blogId = :blogId AND ${
      searchLoginTerm ? 'LOWER(ub.login) LIKE LOWER(:searchLoginTerm)' : 'true'
    }`;
    const sortDirectionSql: 'ASC' | 'DESC' = sortDirection === 'desc' ? 'DESC' : 'ASC';
    const bans = await builder
      .where(subQuery, { blogId: blogId, searchLoginTerm: `%${searchLoginTerm}%` })
      .orderBy(`ub.${sortBy}`, sortDirectionSql)
      .limit(+pageSize)
      .offset(skippedBlogsCount)
      .getMany();
    const count = bans.length;
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
