import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BansRepository } from '../bans/bans.repository';
import { CommentsLikesRepository } from '../likes/comments.likes.repository';
import { CommentViewModel } from './comments.models';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class CommentsQueryRepository {
  constructor(
    protected bansRepository: BansRepository,
    protected commentsLikesRepository: CommentsLikesRepository,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  mapperToCommentViewModel(comment): CommentViewModel {
    return {
      id: comment.id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.userId.toString(),
        userLogin: comment.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likesCount,
        dislikesCount: comment.dislikesCount,
        myStatus: comment.myStatus || 'None',
      },
    };
  }
  async getAllCommentsForPost(
    query: paginationQuerys,
    postId: string,
    userId?: string | null,
  ): Promise<paginatedViewModel<CommentViewModel[]>> {
    const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = query;

    const skippedCommentsNumber = (+pageNumber - 1) * +pageSize;
    const bannedComments = await this.bansRepository.getBannedComments();
    console.log(bannedComments);

    const subQuery = `"id" ${bannedComments.length ? `NOT IN (${bannedComments})` : `IS NOT NULL`}
    AND "postId" = ${postId}`;

    const selectQuery = `SELECT c.*, pi."postId", ci."userId", ci."userLogin",
                                CASE
                                 WHEN "${sortBy}" = LOWER("${sortBy}") THEN 2
                                 ELSE 1
                                END toOrder
                    FROM "Comments" c 
                    LEFT JOIN "PostInfoForComment" pi
                    ON c."id" = pi."commentId"
                    LEFT JOIN "CommentatorInfo" ci
                    ON c."id" = ci."commentId"
                    WHERE ${subQuery}
                    ORDER BY toOrder,
                      CASE when $1 = 'desc' then "${sortBy}" END DESC,
                      CASE when $1 = 'asc' then "${sortBy}" END ASC
                    LIMIT $2
                    OFFSET $3
                    `;
    const counterQuery = `SELECT COUNT(*)
                    FROM "Comments" c 
                    LEFT JOIN "PostInfoForComment" pi
                    ON c."id" = pi."commentId"
                    LEFT JOIN "CommentatorInfo" ci
                    ON c."id" = ci."commentId" 
                    WHERE ${subQuery}`;

    const counter = await this.dataSource.query(counterQuery);
    const count = counter[0].count;
    const comments = await this.dataSource.query(selectQuery, [
      sortDirection,
      pageSize,
      skippedCommentsNumber,
    ]);

    await this.countLikesForComments(comments, userId);

    const commentsView = comments.map(this.mapperToCommentViewModel);
    return {
      pagesCount: Math.ceil(+count / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +count,
      items: commentsView,
    };
  }
  async countLikesForComments(comments, userId?: string) {
    for (const comment of comments) {
      const foundLikes = await this.commentsLikesRepository.findLikesForComment(
        comment.id.toString(),
      );
      if (userId) {
        const likeOfUser = foundLikes.find((like) => like.userId.toString() === userId);
        if (likeOfUser) {
          comment.myStatus = likeOfUser.likeStatus;
        }
      }
      const likesCount = foundLikes.filter((like) => like.likeStatus === 'Like').length;
      const dislikesCount = foundLikes.filter((like) => like.likeStatus === 'Dislike').length;
      comment.likesCount = likesCount;
      comment.dislikesCount = dislikesCount;
    }
  }
  async countLikesForComment(comment, userId?: string) {
    const foundLikes = await this.commentsLikesRepository.findLikesForComment(
      comment.id.toString(),
    );
    if (userId) {
      const likeOfUser = foundLikes.find((like) => like.userId.toString() === userId);
      if (likeOfUser) {
        comment.myStatus = likeOfUser.likeStatus;
      }
    }
    const likesCount = foundLikes.filter((like) => like.likeStatus === 'Like').length;
    const dislikesCount = foundLikes.filter((like) => like.likeStatus === 'Dislike').length;
    comment.likesCount = likesCount;
    comment.dislikesCount = dislikesCount;
  }

  async findCommentById(
    commentId: string,
    userId?: string | null,
  ): Promise<CommentViewModel | null> {
    const bannedComments = await this.bansRepository.getBannedComments();
    const bannedCommentsStrings = bannedComments.map((commentId) => commentId.toString());
    const foundComment = await this.dataSource.query(
      `
          SELECT c.*, pi."postId", ci."userId", ci."userLogin"
                    FROM "Comments" c 
                    LEFT JOIN "PostInfoForComment" pi
                    ON c."id" = pi."commentId"
                    LEFT JOIN "CommentatorInfo" ci
                    ON c."id" = ci."commentId"
          WHERE "id" = $1
      `,
      [commentId],
    );
    if (!foundComment.length) {
      return null;
    }
    if (bannedCommentsStrings.includes(foundComment[0].id.toString())) {
      return null;
    }
    await this.countLikesForComment(foundComment[0], userId);
    return this.mapperToCommentViewModel(foundComment[0]);
  }
}
