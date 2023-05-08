import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BansRepository } from '../bans/bans.repository';
import { BlogBansRepository } from '../bans/bans.blogs.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostViewModel } from './posts.models';
import { Post } from './domain/post.entity';
import { PostLike } from '../likes/domain/postLike.entity';

export class PostsQueryRepository {
  constructor(
    protected bansRepository: BansRepository,
    protected blogBansRepository: BlogBansRepository,
    @InjectRepository(Post)
    private readonly postsTypeOrmRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private readonly postsLikesTypeOrmRepository: Repository<PostLike>,
  ) {}
  mapperToPostViewModel(post): PostViewModel {
    return {
      id: post.p_id.toString(),
      title: post.p_title,
      shortDescription: post.p_shortDescription,
      content: post.p_content,
      blogId: post.p_blogId.toString(),
      blogName: post.p_blogName,
      createdAt: post.p_createdAt,
      extendedLikesInfo: {
        likesCount: +post.likesCount || 0,
        dislikesCount: +post.dislikesCount || 0,
        myStatus: post.myStatus || 'None',
        newestLikes: post.newestLikes || [],
      },
    };
  }
  async getAllPosts(
    query: paginationQuerys,
    blogId?: number,
    userId?: number | null,
  ): Promise<paginatedViewModel<PostViewModel[]>> {
    const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = query;

    const skippedPostsCount = (+pageNumber - 1) * +pageSize;
    const sortDirectionSql: 'ASC' | 'DESC' = sortDirection === 'desc' ? 'DESC' : 'ASC';
    const bannedPostsFromUsers = await this.bansRepository.getBannedPosts();
    const bannedPosts = await this.blogBansRepository.getBannedPosts();
    const allBannedPosts = bannedPosts.concat(bannedPostsFromUsers);

    const subQuery = `p.id ${allBannedPosts.length ? `NOT IN (:...allBannedPosts)` : `IS NOT NULL`} 
    AND (${blogId ? `p.blogId = :blogId` : true})`;

    const orderQuery = `CASE WHEN p."${sortBy}" = LOWER(p."${sortBy}") THEN 2
         ELSE 1 END, p."${sortBy}"`;

    const builder = await this.getBuilder(userId);

    const posts = await builder
      .where(subQuery, { allBannedPosts: allBannedPosts, blogId: blogId })
      .orderBy(orderQuery, sortDirectionSql)
      .limit(+pageSize)
      .offset(skippedPostsCount)
      .getRawMany();
    await this.findThreeLatestLikesForPosts(posts);
    const count = await builder
      .where(subQuery, { allBannedPosts: allBannedPosts, blogId: blogId })
      .getCount();

    const postsView = posts.map(this.mapperToPostViewModel);
    return {
      pagesCount: Math.ceil(+count / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +count,
      items: postsView,
    };
  }
  async getBuilder(userId?: number) {
    return this.postsTypeOrmRepository
      .createQueryBuilder('p')
      .leftJoin('p.likes', 'l')
      .addSelect([
        `(select COUNT(*) FROM post_like where l."postId" = p."id" AND
         l."likeStatus" = 'Like') as "likesCount"`,
      ])
      .addSelect([
        `(select COUNT(*) FROM post_like where l."postId" = p."id"
         AND l."likeStatus" = 'Dislike') as "dislikesCount"`,
      ])
      .addSelect([
        `(${
          userId
            ? `select l."likeStatus" FROM post_like where l."postId" = p."id"
                AND l."userId" = ${userId}`
            : 'false'
        }) as "myStatus"`,
      ]);
  }
  async findThreeLatestLikesForPosts(posts) {
    const bannedUsers = await this.bansRepository.getBannedUsers();
    const builder = await this.postsLikesTypeOrmRepository.createQueryBuilder('pl');
    for (const post of posts) {
      if (post.likesCount === 0) return;
      const subQuery = `pl."postId" = :postId AND pl."userId" ${
        bannedUsers.length ? `NOT IN (:...bannedUsers)` : `IS NOT NULL`
      } AND pl."likeStatus" = 'Like'`;
      const allLikes = await builder
        .where(subQuery, { postId: post.p_id, bannedUsers: bannedUsers })
        .orderBy('pl.createdAt', 'DESC')
        .getMany();
      const threeLatestLikes = allLikes.slice(0, 3);
      post.newestLikes = threeLatestLikes.map((like) => {
        return {
          addedAt: like.createdAt,
          userId: like.userId.toString(),
          login: like.login,
        };
      });
    }
  }
  async findPostById(postId: number, userId?: number | null): Promise<PostViewModel | null> {
    const bannedPostsFromUsers = await this.bansRepository.getBannedPosts();
    const bannedPosts = await this.blogBansRepository.getBannedPosts();
    const allBannedPosts = bannedPosts.concat(bannedPostsFromUsers);
    const builder = await this.getBuilder(userId);
    const post = await builder.where('p.id = :postId', { postId: postId }).getRawOne();
    if (!post) return null;
    if (allBannedPosts.includes(post.p_id)) return null;
    await this.findThreeLatestLikesForPosts([post]);
    return this.mapperToPostViewModel(post);
  }
}
