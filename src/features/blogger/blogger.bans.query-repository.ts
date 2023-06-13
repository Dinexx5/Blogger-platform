import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BannedForBlogUserViewModel } from '../admin/users/user.models';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../public/blogs/blogs.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogOwnerInfoEntity } from './domain/blog-owner-info.entity';
import { UserBanForBlogEntity } from './domain/user-ban-for-blog.entity';

export class BloggerBansQueryRepository {
  constructor(
    protected blogsRepository: BlogsRepository,
    @InjectRepository(BlogOwnerInfoEntity)
    private readonly blogOwnerInfoRepository: Repository<BlogOwnerInfoEntity>,
    @InjectRepository(UserBanForBlogEntity)
    private readonly userBansTypeOrmRepository: Repository<UserBanForBlogEntity>,
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

    const blog = await this.blogsRepository.findBlogById(blogId);
    if (!blog) throw new NotFoundException();
    const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
    if (blogOwnerInfo.userId !== userId) throw new ForbiddenException();

    const builder = this.userBansTypeOrmRepository
      .createQueryBuilder('ub')
      .where('ub.blogId = :blogId', { blogId: blogId });

    if (searchLoginTerm) {
      builder.andWhere('LOWER(ub.login) LIKE LOWER(:searchLoginTerm)', {
        searchLoginTerm: `%${searchLoginTerm}%`,
      });
    }

    const orderQuery = `CASE WHEN "${sortBy}" = LOWER("${sortBy}") THEN 2
         ELSE 1 END, "${sortBy}"`;

    const [bans, totalCount] = await builder
      .orderBy(orderQuery, sortDirection === 'desc' ? 'DESC' : 'ASC')
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .getManyAndCount();

    const bansView = bans.map(this.mapFoundBansToViewModel);
    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: bansView,
    };
  }
}
