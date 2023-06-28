import { paginatedViewModel, paginationQuerys } from '../../../shared/models/pagination';
import { BansRepository } from '../../bans/bans.repository';
import { BlogBansRepository } from '../../bans/bans.blogs.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostViewModel } from './posts.models';
import { PostEntity } from './domain/post.entity';
import { PostLike } from '../../likes/domain/post-like.entity';

export class PostsQueryRepository {
  constructor(
    protected bansRepository: BansRepository,
    protected blogBansRepository: BlogBansRepository,
    @InjectRepository(PostEntity)
    private readonly postsTypeOrmRepository: Repository<PostEntity>,
    @InjectRepository(PostLike)
    private readonly postsLikesTypeOrmRepository: Repository<PostLike>,
  ) {}
  mapperToPostViewModel(post) {
    return {
      id: post.id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId.toString(),
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: +post.likesCount || 0,
        dislikesCount: +post.dislikesCount || 0,
        myStatus: post.myStatus || 'None',
        newestLikes: post.newestLikes || [],
      },
      images: {
        main: post.mainPictures
          ? post.mainPictures
              .sort((a, b) => b.fileSize - a.fileSize)
              .map((picture) => ({
                url: picture.relativeUrl,
                width: picture.width,
                height: picture.height,
                fileSize: picture.fileSize,
              }))
          : [],
      },
    };
  }
  async getAllPosts(query: paginationQuerys, blogId?: number, userId?: number | null) {
    const { sortDirection = 'asc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = query;

    const bannedPostsFromUsers = await this.bansRepository.getBannedPosts();
    const bannedPosts = await this.blogBansRepository.getBannedPosts();
    const allBannedPosts = bannedPosts.concat(bannedPostsFromUsers);

    const subQuery = `p.id ${allBannedPosts.length ? `NOT IN (:...allBannedPosts)` : `IS NOT NULL`} 
    AND (${blogId ? `p.blogId = :blogId` : true})`;

    const orderQuery = `CASE WHEN p.${sortBy} = LOWER(p.${sortBy}) THEN 2
         ELSE 1 END, p.${sortBy}`;

    const builder = await this.getBuilder(userId);

    // const SQLquery = builder
    //   .where(subQuery, { allBannedPosts: allBannedPosts, blogId: blogId })
    //   .orderBy(orderQuery, sortDirection === 'desc' ? 'DESC' : 'ASC')
    //   .offset((+pageNumber - 1) * +pageSize)
    //   .getQuery();
    // console.log(SQLquery);

    const posts = await builder
      .where(subQuery, { allBannedPosts: allBannedPosts, blogId: blogId })
      .orderBy(orderQuery, sortDirection === 'desc' ? 'DESC' : 'ASC')
      .offset((+pageNumber - 1) * +pageSize)
      .getMany();

    await this.findThreeLatestLikesForPosts(posts);

    const count = posts.length;

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
    const bannedUsers = await this.bansRepository.getBannedUsers();
    return this.postsTypeOrmRepository
      .createQueryBuilder('p')
      .leftJoin('p.likes', 'l')
      .leftJoinAndSelect('p.mainPictures', 'mp')
      .addSelect([
        `(select COUNT(*) FROM post_like where l."postId" = p."id" AND
         l."likeStatus" = 'Like'
         AND ${
           bannedUsers.length ? `l."userId" NOT IN (${bannedUsers})` : 'true'
         }) as "likesCount"`,
      ])
      .addSelect([
        `(select COUNT(*) FROM post_like where l."postId" = p."id"
         AND l."likeStatus" = 'Dislike'
         AND ${
           bannedUsers.length ? `l."userId" NOT IN (${bannedUsers})` : 'true'
         }) as "dislikesCount"`,
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
    const subQuery = `pl."postId" = :postId AND pl."userId" ${
      bannedUsers.length ? `NOT IN (:...bannedUsers)` : `IS NOT NULL`
    } AND pl."likeStatus" = 'Like'`;

    for (const post of posts) {
      if (post.likesCount === 0) return;
      const allLikes = await builder
        .where(subQuery, { postId: post.id, bannedUsers: bannedUsers })
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
  async findPostById(postId: number, userId?: number | null) {
    const bannedPostsFromUsers = await this.bansRepository.getBannedPosts();
    const bannedPosts = await this.blogBansRepository.getBannedPosts();
    const allBannedPosts = bannedPosts.concat(bannedPostsFromUsers);
    const builder = await this.getBuilder(userId);
    const post = await builder.where('p.id = :postId', { postId: postId }).getOne();
    if (!post) return null;
    if (allBannedPosts.includes(post.id)) return null;
    await this.findThreeLatestLikesForPosts([post]);
    return this.mapperToPostViewModel(post);
  }
}
