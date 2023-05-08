import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BlogViewModel } from './blogs.models';
import { BansRepository } from '../bans/bans.repository';
import { BlogBansRepository } from '../bans/bans.blogs.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './domain/blog.entity';

export class BlogsQueryRepository {
  constructor(
    protected bansRepository: BansRepository,
    protected blogBansRepository: BlogBansRepository,
    @InjectRepository(Blog)
    private readonly blogsTypeOrmRepository: Repository<Blog>,
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

    const builder = this.blogsTypeOrmRepository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.blogOwnerInfo', 'oi');

    const bannedSubQuery = `${
      allBannedBlogs.length ? 'b.id NOT IN (:...allBannedBlogs)' : 'b.id IS NOT NULL'
    }`;

    const userIdSubQuery = `${userId ? 'oi.userId = :userId' : 'true'}`;

    const searchNameTermQuery = `${
      searchNameTerm ? 'LOWER(b.name) LIKE LOWER(:searchNameTerm)' : 'true'
    }`;

    const sortDirectionSql: 'ASC' | 'DESC' = sortDirection === 'desc' ? 'DESC' : 'ASC';
    const blogs = await builder
      .where(bannedSubQuery, { allBannedBlogs: allBannedBlogs })
      .andWhere(userIdSubQuery, { userId: userId })
      .andWhere(searchNameTermQuery, { searchNameTerm: `%${searchNameTerm}%` })
      .orderBy(`b.${sortBy}`, sortDirectionSql)
      .limit(+pageSize)
      .offset(skippedBlogsCount)
      .getMany();
    const count = blogs.length;
    const blogsView = blogs.map(this.mapFoundBlogToBlogViewModel);
    return {
      pagesCount: Math.ceil(+count / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +count,
      items: blogsView,
    };
  }

  async findBlogById(blogId: number): Promise<BlogViewModel | null> {
    const bannedBlogsFromUsers = await this.bansRepository.getBannedBlogs();
    const bannedBlogs = await this.blogBansRepository.getBannedBlogs();
    const allBannedBlogs = bannedBlogs.concat(bannedBlogsFromUsers);
    const foundBlog = await this.blogsTypeOrmRepository.findOneBy({ id: blogId });
    if (!foundBlog) return null;
    if (allBannedBlogs.includes(foundBlog.id)) return null;
    return this.mapFoundBlogToBlogViewModel(foundBlog);
  }
}
