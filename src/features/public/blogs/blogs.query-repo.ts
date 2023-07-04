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
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: blog.isMembership,
      createdAt: blog.createdAt,
      id: blog.id.toString(),
      images: {
        wallpaper: blog.wallpaper
          ? {
              url: blog.wallpaper.url,
              width: blog.wallpaper.width,
              height: blog.wallpaper.height,
              fileSize: blog.wallpaper.fileSize,
            }
          : null,
        main: blog.mainPicture
          ? [
              {
                url: blog.mainPicture.url,
                width: blog.mainPicture.width,
                height: blog.mainPicture.height,
                fileSize: blog.mainPicture.fileSize,
              },
            ]
          : [],
      },
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

    const builder = this.blogsTypeOrmRepository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.blogOwnerInfo', 'oi')
      .leftJoinAndSelect('b.wallpaper', 'w')
      .leftJoinAndSelect('b.mainPicture', 'mp');

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

    const orderQuery = `CASE WHEN "${sortBy}" = LOWER("${sortBy}") THEN 2
         ELSE 1 END, "${sortBy}"`;

    const [blogs, count] = await builder
      .orderBy(orderQuery, sortDirection === 'desc' ? 'DESC' : 'ASC')
      .limit(+pageSize)
      .offset(skippedBlogsCount)
      .getManyAndCount();

    const blogsView = blogs.map(this.mapFoundBlogToBlogViewModel);
    return {
      pagesCount: Math.ceil(count / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: count,
      items: blogsView,
    };
  }

  async findBlogById(blogId: number): Promise<BlogViewModel> {
    const bannedBlogsFromUsers = await this.bansRepository.getBannedBlogs();
    const bannedBlogs = await this.blogBansRepository.getBannedBlogs();
    const allBannedBlogs = bannedBlogs.concat(bannedBlogsFromUsers);
    const builder = this.blogsTypeOrmRepository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.wallpaper', 'w')
      .leftJoinAndSelect('b.mainPicture', 'mp')
      .where('b.id = :blogId', {
        blogId: blogId,
      });
    const foundBlog = await builder.getOne();
    if (!foundBlog) throw new NotFoundException();
    if (allBannedBlogs.includes(foundBlog.id)) return null;
    return this.mapFoundBlogToBlogViewModel(foundBlog);
  }
}
