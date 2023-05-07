"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsQueryRepository = void 0;
const bans_repository_1 = require("../bans/bans.repository");
const posts_likes_repository_1 = require("../likes/posts.likes.repository");
const bans_blogs_repository_1 = require("../bans/bans.blogs.repository");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let PostsQueryRepository = class PostsQueryRepository {
    constructor(bansRepository, postsLikesRepository, blogBansRepository, dataSource) {
        this.bansRepository = bansRepository;
        this.postsLikesRepository = postsLikesRepository;
        this.blogBansRepository = blogBansRepository;
        this.dataSource = dataSource;
    }
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
                likesCount: post.likesCount || 0,
                dislikesCount: post.dislikesCount || 0,
                myStatus: post.myStatus || 'None',
                newestLikes: post.newestLikes || [],
            },
        };
    }
    async getAllPosts(query, blogId, userId) {
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
    async countLikesForPosts(posts, userId) {
        for (const post of posts) {
            const foundLikes = await this.postsLikesRepository.findLikesForPost(post.id.toString());
            if (!foundLikes)
                return;
            const threeLatestLikes = await this.postsLikesRepository.findThreeLatestLikes(post.id.toString());
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
            const newestLikes = [];
            newestLikes.push(...threeLatestLikes);
            post.newestLikes = newestLikes;
        }
    }
    async countLikesForPost(post, userId) {
        const foundLikes = await this.postsLikesRepository.findLikesForPost(post.id.toString());
        const threeLatestLikes = await this.postsLikesRepository.findThreeLatestLikes(post.id.toString());
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
        const newestLikes = [];
        newestLikes.push(...threeLatestLikes);
        post.newestLikes = newestLikes;
    }
    async findPostById(postId, userId) {
        const bannedPostsFromUsers = await this.bansRepository.getBannedPosts();
        const bannedPosts = await this.blogBansRepository.getBannedPosts();
        const allBannedPosts = bannedPosts.concat(bannedPostsFromUsers);
        const bannedPostsStrings = allBannedPosts.map((postId) => postId.toString());
        const foundPost = await this.dataSource.query(`
          SELECT *
          FROM "Posts"
          WHERE "id" = $1
      `, [postId]);
        if (!foundPost.length) {
            return null;
        }
        if (bannedPostsStrings.includes(foundPost[0].id.toString())) {
            return null;
        }
        await this.countLikesForPost(foundPost[0], userId);
        return this.mapperToPostViewModel(foundPost[0]);
    }
};
PostsQueryRepository = __decorate([
    __param(3, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [bans_repository_1.BansRepository,
        posts_likes_repository_1.PostsLikesRepository,
        bans_blogs_repository_1.BlogBansRepository,
        typeorm_2.DataSource])
], PostsQueryRepository);
exports.PostsQueryRepository = PostsQueryRepository;
//# sourceMappingURL=posts.query-repo.js.map