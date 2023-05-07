import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BlogsRepository } from '../blogs/blogs.repository';
import { PostsRepository } from '../posts/posts.repository';
import { commentsForBloggerViewModel } from '../comments/comments.models';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Comment } from '../comments/domain/comment.entity';

export class BloggerCommentsQueryRepository {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Comment)
    private readonly commentsTypeOrmRepository: Repository<Comment>,
  ) {}
  mapCommentsToViewModel(comment): commentsForBloggerViewModel {
    return {
      id: comment.c_id.toString(),
      content: comment.c_content,
      commentatorInfo: {
        userId: comment.ci_userId.toString(),
        userLogin: comment.ci_userLogin,
      },
      createdAt: comment.c_createdAt,
      likesInfo: {
        likesCount: comment.likesCount || 0,
        dislikesCount: comment.dislikesCount || 0,
        myStatus: comment.myStatus || 'None',
      },
      postInfo: {
        id: comment.pi_postId.toString(),
        title: comment.pi_title,
        blogId: comment.pi_blogId.toString(),
        blogName: comment.pi_blogName,
      },
    };
  }
  async getAllComments(
    query: paginationQuerys,
    userId: number,
  ): Promise<paginatedViewModel<commentsForBloggerViewModel[]>> {
    const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = query;
    const skippedCommentsCount = (+pageNumber - 1) * +pageSize;

    const allBlogs: number[] = await this.blogsRepository.findBlogsForUser(userId);
    const allPosts: number[] = await this.postsRepository.findPostsForUser(allBlogs);
    const sortDirectionSql: 'ASC' | 'DESC' = sortDirection === 'desc' ? 'DESC' : 'ASC';

    const builder = this.commentsTypeOrmRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.commentatorInfo', 'ci')
      .leftJoinAndSelect('c.postInfo', 'pi')
      .leftJoin('c.likes', 'l')
      .addSelect([
        `(select COUNT(*) FROM comment_like where l."commentId" = c."id" AND l."likeStatus" = 'Like') as "likesCount"`,
      ])
      .addSelect([
        `(select COUNT(*) FROM comment_like where l."commentId" = c."id" AND l."likeStatus" = 'Dislike') as "dislikesCount"`,
      ])
      .addSelect([
        `(select l."likeStatus" FROM comment_like where l."commentId" = c."id" AND l."userId" = ${userId}) as "myStatus"`,
      ]);

    const subQuery = `${allPosts.length ? `pi.postId IN (:...allPosts)` : `false`}`;

    const comments = await builder
      .where(subQuery, { allPosts: allPosts })
      .orderBy(`c.${sortBy}`, sortDirectionSql)
      .limit(+pageSize)
      .offset(skippedCommentsCount)
      .getRawMany();

    const count = comments.length;

    const commentsView = comments.map(this.mapCommentsToViewModel);
    return {
      pagesCount: Math.ceil(+count / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +count,
      items: commentsView,
    };
  }
}
