import { paginatedViewModel, paginationQuerys } from '../../../shared/models/pagination';
import { BlogViewModel } from './blogs.models';
import { BansRepository } from '../../bans/bans.repository';
import { BlogBansRepository } from '../../bans/bans.blogs.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity } from '../../blogger/domain/blog.entity';
import { NotFoundException } from '@nestjs/common';

export class BlogsQueryRepository {
  constructor(
    protected bansRepository: BansRepository,
    protected blogBansRepository: BlogBansRepository,
    @InjectRepository(BlogEntity)
    private readonly blogsTypeOrmRepository: Repository<BlogEntity>,
  ) {}
  mapFoundBlogToBlogViewModel(blog) {
    return {
      name: blog.b_name,
      description: blog.b_description,
      websiteUrl: blog.b_websiteUrl,
      isMembership: blog.b_isMembership,
      createdAt: blog.b_createdAt,
      id: blog.b_id.toString(),
      images: {
        wallpaper: blog.w_url
          ? {
              url: blog.w_url,
              width: blog.w_width,
              height: blog.w_height,
              fileSize: blog.w_fileSize,
            }
          : null,
        main: blog.mp_url
          ? [
              {
                url: blog.mp_url,
                width: blog.mp_width,
                height: blog.mp_height,
                fileSize: blog.mp_fileSize,
              },
            ]
          : [],
      },
      currentUserSubscriptionStatus: blog.currentUserSubscriptionStatus || 'None',
      subscribersCount: blog.subscribersCount,
    };
  }
  async getAllBlogs(query: paginationQuerys, userId?: number, viewerId?: number) {
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

    const builder = this.blogsTypeOrmRepository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.blogOwnerInfo', 'oi')
      .leftJoinAndSelect('b.wallpaper', 'w')
      .leftJoinAndSelect('b.mainPicture', 'mp')
      .leftJoinAndSelect('b.subscriptions', 's')
      .addSelect([
        `(select COUNT(*) FROM subscription_entity where s."status" = 'Subscribed' AND s."blogId" = b."id")
                 as "subscribersCount"`,
      ]);

    if (allBannedBlogs.length) {
      builder.andWhere('b.id NOT IN (:...allBannedBlogs)', {
        allBannedBlogs: allBannedBlogs,
      });
    }
    if (searchNameTerm) {
      builder.andWhere('LOWER(b.name) LIKE LOWER(:searchNameTerm)', {
        searchNameTerm: `%${searchNameTerm}%`,
      });
    }
    if (userId) {
      builder.andWhere('oi.userId = :userId', {
        userId: userId,
      });
    }
    if (viewerId) {
      builder.addSelect([
        `(select s."status" FROM subscription_entity where s."userId" = ${viewerId} AND s."blogId" = b."id")
         as "currentUserSubscriptionStatus"`,
      ]);
    }

    const orderQuery = `CASE WHEN "${sortBy}" = LOWER("${sortBy}") THEN 2
         ELSE 1 END, "${sortBy}"`;

    const blogs = await builder
      .orderBy(orderQuery, sortDirection === 'desc' ? 'DESC' : 'ASC')
      .limit(+pageSize)
      .offset(skippedBlogsCount)
      .getRawMany();

    const count = blogs.length;

    const blogsView = blogs.map(this.mapFoundBlogToBlogViewModel);
    return {
      pagesCount: Math.ceil(count / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: count,
      items: blogsView,
    };
  }

  async findBlogById(blogId: number, viewerId?: number) {
    const bannedBlogsFromUsers = await this.bansRepository.getBannedBlogs();
    const bannedBlogs = await this.blogBansRepository.getBannedBlogs();
    const allBannedBlogs = bannedBlogs.concat(bannedBlogsFromUsers);
    const builder = this.blogsTypeOrmRepository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.wallpaper', 'w')
      .leftJoinAndSelect('b.mainPicture', 'mp')
      .leftJoinAndSelect('b.subscriptions', 's')
      .where('b.id = :blogId', {
        blogId: blogId,
      })
      .addSelect([
        `(select COUNT(*) FROM subscription_entity where s."status" = 'Subscribed' AND s."blogId" = b."id")
                 as "subscribersCount"`,
      ]);
    if (viewerId) {
      builder.addSelect([
        `(select s."status" FROM subscription_entity where s."userId" = ${viewerId} AND s."blogId" = b."id")
         as "currentUserSubscriptionStatus"`,
      ]);
    }
    const foundBlog = await builder.getRawOne();
    if (!foundBlog) throw new NotFoundException();
    if (allBannedBlogs.includes(foundBlog.id)) return null;
    return this.mapFoundBlogToBlogViewModel(foundBlog);
  }
}
