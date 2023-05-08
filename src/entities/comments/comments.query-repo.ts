import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BansRepository } from '../bans/bans.repository';
import { CommentViewModel } from './comments.models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './domain/comment.entity';

export class CommentsQueryRepository {
  constructor(
    protected bansRepository: BansRepository,
    @InjectRepository(Comment)
    private readonly commentsTypeOrmRepository: Repository<Comment>,
  ) {}
  mapperToCommentViewModel(comment): CommentViewModel {
    return {
      id: comment.c_id.toString(),
      content: comment.c_content,
      commentatorInfo: {
        userId: comment.ci_userId.toString(),
        userLogin: comment.ci_userLogin,
      },
      createdAt: comment.c_createdAt,
      likesInfo: {
        likesCount: +comment.likesCount,
        dislikesCount: +comment.dislikesCount,
        myStatus: comment.myStatus || 'None',
      },
    };
  }
  async getAllCommentsForPost(
    query: paginationQuerys,
    postId: number,
    userId?: number | null,
  ): Promise<paginatedViewModel<CommentViewModel[]>> {
    const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = query;

    const skippedCommentsCount = (+pageNumber - 1) * +pageSize;
    const sortDirectionSql: 'ASC' | 'DESC' = sortDirection === 'desc' ? 'DESC' : 'ASC';
    const bannedComments = await this.bansRepository.getBannedComments();

    const builder = await this.getBuilder(userId);
    const orderQuery = `CASE WHEN c."${sortBy}" = LOWER(c."${sortBy}") THEN 2
         ELSE 1 END, c."${sortBy}"`;
    const subQuery = `c.id ${
      bannedComments.length ? `NOT IN (:...bannedComments)` : `IS NOT NULL`
    } AND pi.postId = :postId`;

    const comments = await builder
      .where(subQuery, { bannedComments: bannedComments, postId: postId })
      .orderBy(orderQuery, sortDirectionSql)
      .limit(+pageSize)
      .offset(skippedCommentsCount)
      .getRawMany();
    const count = await builder
      .where(subQuery, { bannedComments: bannedComments, postId: postId })
      .getCount();

    const commentsView = comments.map(this.mapperToCommentViewModel);
    return {
      pagesCount: Math.ceil(+count / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +count,
      items: commentsView,
    };
  }
  async getBuilder(userId?: number) {
    const bannedUsers = await this.bansRepository.getBannedUsers();
    return this.commentsTypeOrmRepository
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
        `(${
          userId
            ? `select l."likeStatus" FROM comment_like where l."commentId" = c."id"
                AND l."userId" = ${userId}`
            : 'false'
        }) as "myStatus"`,
      ]);
  }

  async findCommentById(
    commentId: number,
    userId?: number | null,
  ): Promise<CommentViewModel | null> {
    const bannedComments = await this.bansRepository.getBannedComments();
    const builder = await this.getBuilder(userId);
    const comment = await builder.where('c.id = :commentId', { commentId: commentId }).getRawOne();
    if (!comment) return null;
    if (bannedComments.includes(comment.c_id)) return null;
    return this.mapperToCommentViewModel(comment);
  }
}
