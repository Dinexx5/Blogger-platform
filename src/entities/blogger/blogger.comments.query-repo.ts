import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BlogsRepository } from '../blogs/blogs.repository';
import { PostsRepository } from '../posts/posts.repository';
import { commentsForBloggerViewModel } from '../comments/comments.models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../comments/domain/comment.entity';
import { BansRepository } from '../bans/bans.repository';

export class BloggerCommentsQueryRepository {
  constructor(
    protected bansRepository: BansRepository,
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
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
        likesCount: +comment.likesCount || 0,
        dislikesCount: +comment.dislikesCount || 0,
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
    const bannedUsers = await this.bansRepository.getBannedUsers();
    const sortDirectionSql: 'ASC' | 'DESC' = sortDirection === 'desc' ? 'DESC' : 'ASC';

    const subQuery = `${allPosts.length ? `pi.postId IN (:...allPosts)` : `false`}`;
    const orderQuery = `CASE WHEN c."${sortBy}" = LOWER(c."${sortBy}") THEN 2
         ELSE 1 END, c."${sortBy}"`;

    const builder = this.commentsTypeOrmRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.commentatorInfo', 'ci')
      .leftJoinAndSelect('c.postInfo', 'pi')
      .leftJoin('c.likes', 'l')
      .addSelect([
        `(select COUNT(*) FROM comment_like where l."commentId" = c."id"
         AND l."likeStatus" = 'Like'
         AND ${
           bannedUsers.length ? `l."userId" NOT IN (${bannedUsers})` : 'true'
         }) as "likesCount"`,
      ])
      .addSelect([
        `(select COUNT(*) FROM comment_like where l."commentId" = c."id"
         AND l."likeStatus" = 'Dislike'
         AND ${
           bannedUsers.length ? `l."userId" NOT IN (${bannedUsers})` : 'true'
         }) as "dislikesCount"`,
      ])
      .addSelect([
        `(select l."likeStatus" FROM comment_like where l."commentId" = c."id"
         AND l."userId" = ${userId}) as "myStatus"`,
      ])
      .where(subQuery, { allPosts: allPosts });

    const comments = await builder
      .orderBy(orderQuery, sortDirectionSql)
      .limit(+pageSize)
      .offset(skippedCommentsCount)
      .getRawMany();

    const count = await builder.getCount();

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
