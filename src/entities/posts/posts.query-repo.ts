import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BansRepository } from '../bans/bans.repository';
import { PostsLikesRepository } from '../likes/posts.likes.repository';
import { BlogBansRepository } from '../bans/bans.blogs.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { NewestLikes, PostViewModel } from './posts.models';

export class PostsQueryRepository {
  constructor(
    protected bansRepository: BansRepository,
    protected postsLikesRepository: PostsLikesRepository,
    protected blogBansRepository: BlogBansRepository,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  mapperToPostViewModel(post): PostViewModel {
    return {
      id: post.id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId.toString(),
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: post.likesCount || 0,
        dislikesCount: post.dislikesCount || 0,
        myStatus: post.myStatus || 'None',
        newestLikes: post.newestLikes || [],
      },
    };
  }
  async getAllPosts(
    query: paginationQuerys,
    blogId?: string,
    userId?: string | null,
  ): Promise<paginatedViewModel<PostViewModel[]>> {
    const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = query;

    const skippedPostsNumber = (+pageNumber - 1) * +pageSize;
    const bannedPostsFromUsers = await this.bansRepository.getBannedPosts();
    const bannedPosts = await this.blogBansRepository.getBannedPosts();
    const allBannedPosts = bannedPosts.concat(bannedPostsFromUsers);

    const subQuery = `"id" ${allBannedPosts.length ? `NOT IN (${allBannedPosts})` : `IS NOT NULL`} 
    AND (${blogId ? `"blogId" = ${blogId}` : true})`;

    const selectQuery = `SELECT *,
                                CASE
                                 WHEN "${sortBy}" = LOWER("${sortBy}") THEN 2
                                 ELSE 1
                                END toOrder
                    FROM "Posts"
                    WHERE ${subQuery}
                    ORDER BY toOrder,
                      CASE when $1 = 'desc' then "${sortBy}" END DESC,
                      CASE when $1 = 'asc' then "${sortBy}" END ASC
                    LIMIT $2
                    OFFSET $3
                    `;

    const posts = await this.dataSource.query(selectQuery, [
      sortDirection,
      pageSize,
      skippedPostsNumber,
    ]);
    const count = posts.length;
    await this.countLikesForPosts(posts, userId);

    const postsView = posts.map(this.mapperToPostViewModel);
    return {
      pagesCount: Math.ceil(+count / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +count,
      items: postsView,
    };
  }
  async countLikesForPosts(posts, userId?: string) {
    for (const post of posts) {
      const foundLikes = await this.postsLikesRepository.findLikesForPost(post.id.toString());
      if (!foundLikes) return;
      const threeLatestLikes = await this.postsLikesRepository.findThreeLatestLikes(
        post.id.toString(),
      );
      if (userId) {
        const likeOfUser = foundLikes.find((like) => like.userId.toString() === userId);
        if (likeOfUser) {
          post.myStatus = likeOfUser.likeStatus;
        }
      }
      const likesCount = foundLikes.filter((like) => like.likeStatus === 'Like').length;
      const dislikesCount = foundLikes.filter((like) => like.likeStatus === 'Dislike').length;
      post.likesCount = likesCount;
      post.dislikesCount = dislikesCount;
      const newestLikes: NewestLikes[] = [];
      newestLikes.push(...threeLatestLikes);
      post.newestLikes = newestLikes;
    }
  }
  async countLikesForPost(post, userId?: string) {
    const foundLikes = await this.postsLikesRepository.findLikesForPost(post.id.toString());
    const threeLatestLikes = await this.postsLikesRepository.findThreeLatestLikes(
      post.id.toString(),
    );
    if (userId) {
      const likeOfUser = foundLikes.find((like) => like.userId.toString() === userId);
      if (likeOfUser) {
        post.myStatus = likeOfUser.likeStatus;
      }
    }
    const likesCount = foundLikes.filter((like) => like.likeStatus === 'Like').length;
    const dislikesCount = foundLikes.filter((like) => like.likeStatus === 'Dislike').length;
    post.likesCount = likesCount;
    post.dislikesCount = dislikesCount;
    const newestLikes: NewestLikes[] = [];
    newestLikes.push(...threeLatestLikes);
    post.newestLikes = newestLikes;
  }

  async findPostById(postId: string, userId?: string | null): Promise<PostViewModel | null> {
    const bannedPostsFromUsers = await this.bansRepository.getBannedPosts();
    const bannedPosts = await this.blogBansRepository.getBannedPosts();
    const allBannedPosts = bannedPosts.concat(bannedPostsFromUsers);
    const bannedPostsStrings = allBannedPosts.map((postId) => postId.toString());
    const foundPost = await this.dataSource.query(
      `
          SELECT *
          FROM "Posts"
          WHERE "id" = $1
      `,
      [postId],
    );
    if (!foundPost.length) {
      return null;
    }
    if (bannedPostsStrings.includes(foundPost[0].id.toString())) {
      return null;
    }
    await this.countLikesForPost(foundPost[0], userId);
    return this.mapperToPostViewModel(foundPost[0]);
  }
}
