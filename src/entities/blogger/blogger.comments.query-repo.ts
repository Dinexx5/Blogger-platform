import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BlogsRepository } from '../blogs/blogs.repository';
import { PostsRepository } from '../posts/posts.repository';
import { commentsForBloggerViewModel } from '../comments/comments.models';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentsLikesRepository } from '../likes/comments.likes.repository';

export class BloggerCommentsQueryRepository {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    protected commentsLikesRepository: CommentsLikesRepository,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  mapCommentsToViewModel(comment): commentsForBloggerViewModel {
    return {
      id: comment.id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.userId.toString(),
        userLogin: comment.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likesCount || 0,
        dislikesCount: comment.dislikesCount || 0,
        myStatus: comment.myStatus || 'None',
      },
      postInfo: {
        id: comment.postId.toString(),
        title: comment.title,
        blogId: comment.blogId.toString(),
        blogName: comment.blogName,
      },
    };
  }
  async getAllComments(
    query: paginationQuerys,
    userId: string,
  ): Promise<paginatedViewModel<commentsForBloggerViewModel[]>> {
    const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = query;
    const skippedCommentsCount = (+pageNumber - 1) * +pageSize;

    const allBlogs = await this.blogsRepository.findBlogsForUser(userId);
    const allPosts = await this.postsRepository.findPostsToGetComments(allBlogs);

    const subQuery = `${allPosts.length ? `"postId" IN (${allPosts})` : `false`}`;
    const selectQuery = `SELECT c.*, ci."userId", ci."userLogin", pi.*,
                                CASE
                                 WHEN "${sortBy}" = LOWER("${sortBy}") THEN 2
                                 ELSE 1
                                END toOrder
                    FROM "Comments" c
                    LEFT JOIN "CommentatorInfo" ci
                    ON c."id" = ci."commentId"
                    LEFT JOIN "PostInfoForComment" pi
                    ON c."id" = pi."commentId"
                    WHERE ${subQuery}
                    ORDER BY toOrder,
                      CASE when $1 = 'desc' then "${sortBy}" END DESC,
                      CASE when $1 = 'asc' then "${sortBy}" END ASC
                    LIMIT $2
                    OFFSET $3
                    `;
    const counterQuery = `SELECT COUNT(*)
                    FROM "Comments" c
                    LEFT JOIN "CommentatorInfo" ci
                    ON c."id" = ci."commentId"
                    LEFT JOIN "PostInfoForComment" pi
                    ON c."id" = pi."commentId"
                    WHERE ${subQuery}`;

    const counter = await this.dataSource.query(counterQuery);
    const count = counter[0].count;
    const comments = await this.dataSource.query(selectQuery, [
      sortDirection,
      pageSize,
      skippedCommentsCount,
    ]);

    await this.countLikesForComments(comments, userId);
    const commentsView = comments.map(this.mapCommentsToViewModel);
    return {
      pagesCount: Math.ceil(+count / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +count,
      items: commentsView,
    };
  }
  async countLikesForComments(comments, userId: string) {
    for (const comment of comments) {
      const foundLikes = await this.commentsLikesRepository.findLikesForComment(
        comment.id.toString(),
      );
      if (!foundLikes) return;
      const likeOfUser = foundLikes.find((like) => like.userId.toString() === userId);
      if (likeOfUser) {
        comment.myStatus = likeOfUser.likeStatus;
      }
      const likesCount = foundLikes.filter((like) => like.likeStatus === 'Like').length;
      const dislikesCount = foundLikes.filter((like) => like.likeStatus === 'Dislike').length;
      comment.likesCount = likesCount;
      comment.dislikesCount = dislikesCount;
    }
  }
}
