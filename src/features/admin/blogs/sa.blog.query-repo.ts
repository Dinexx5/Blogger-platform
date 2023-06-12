import { paginatedViewModel, paginationQuerys } from '../../../shared/models/pagination';
import { BlogSAViewModel } from '../../public/blogs/blogs.models';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BlogEntity } from '../../blogger/domain/blog.entity';

export class BlogsSAQueryRepository {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogsTypeOrmRepository: Repository<BlogEntity>,
  ) {}
  mapFoundBlogToBlogViewModel(blog): BlogSAViewModel {
    return {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: blog.isMembership,
      createdAt: blog.createdAt,
      id: blog.id.toString(),
      blogOwnerInfo: {
        userId: blog.blogOwnerInfo.userId.toString(),
        userLogin: blog.blogOwnerInfo.userLogin,
      },
      banInfo: {
        isBanned: blog.banInfo.isBanned,
        banDate: blog.banInfo.banDate,
      },
    };
  }
  async getAllBlogs(query: paginationQuerys): Promise<paginatedViewModel<BlogSAViewModel[]>> {
    const {
      sortDirection = 'desc',
      sortBy = 'createdAt',
      pageNumber = 1,
      pageSize = 10,
      searchNameTerm = null,
    } = query;

    const skippedBlogsCount = (+pageNumber - 1) * +pageSize;

    const searchNameTermQuery = `${
      searchNameTerm ? 'LOWER(b.name) LIKE LOWER(:searchNameTerm)' : 'true'
    }`;
    const sortDirectionSql: 'ASC' | 'DESC' = sortDirection === 'desc' ? 'DESC' : 'ASC';
    const orderQuery = `CASE WHEN "${sortBy}" = LOWER("${sortBy}") THEN 2
         ELSE 1 END, "${sortBy}"`;

    const builder = this.blogsTypeOrmRepository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.blogOwnerInfo', 'oi')
      .leftJoinAndSelect('b.banInfo', 'bi')
      .where(searchNameTermQuery, { searchNameTerm: `%${searchNameTerm}%` });

    const blogs = await builder
      .orderBy(orderQuery, sortDirectionSql)
      .limit(+pageSize)
      .offset(skippedBlogsCount)
      .getMany();
    const count = await builder.getCount();
    const blogsView = blogs.map(this.mapFoundBlogToBlogViewModel);
    return {
      pagesCount: Math.ceil(+count / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +count,
      items: blogsView,
    };
  }
}
