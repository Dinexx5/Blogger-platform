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
const bans_blogs_repository_1 = require("../bans/bans.blogs.repository");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("./domain/post.entity");
const postLike_entity_1 = require("../likes/domain/postLike.entity");
let PostsQueryRepository = class PostsQueryRepository {
    constructor(bansRepository, blogBansRepository, postsTypeOrmRepository, postsLikesTypeOrmRepository) {
        this.bansRepository = bansRepository;
        this.blogBansRepository = blogBansRepository;
        this.postsTypeOrmRepository = postsTypeOrmRepository;
        this.postsLikesTypeOrmRepository = postsLikesTypeOrmRepository;
    }
    mapperToPostViewModel(post) {
        return {
            id: post.p_id.toString(),
            title: post.p_title,
            shortDescription: post.p_shortDescription,
            content: post.p_content,
            blogId: post.p_blogId.toString(),
            blogName: post.p_blogName,
            createdAt: post.p_createdAt,
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
        const skippedPostsCount = (+pageNumber - 1) * +pageSize;
        const sortDirectionSql = sortDirection === 'desc' ? 'DESC' : 'ASC';
        const bannedPostsFromUsers = await this.bansRepository.getBannedPosts();
        const bannedPosts = await this.blogBansRepository.getBannedPosts();
        const allBannedPosts = bannedPosts.concat(bannedPostsFromUsers);
        const subQuery = `p.id ${allBannedPosts.length ? `NOT IN (:...allBannedPosts)` : `IS NOT NULL`} 
    AND (${blogId ? `p.blogId = :blogId` : true})`;
        const builder = await this.getBuilder(userId);
        const posts = await builder
            .where(subQuery, { allBannedPosts: allBannedPosts, blogId: blogId })
            .orderBy(`p.${sortBy}`, sortDirectionSql)
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
    async getBuilder(userId) {
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
            `(${userId
                ? `select l."likeStatus" FROM post_like where l."postId" = p."id"
                AND l."userId" = ${userId}`
                : 'false'}) as "myStatus"`,
        ]);
    }
    async findThreeLatestLikesForPosts(posts) {
        const bannedUsers = await this.bansRepository.getBannedUsers();
        const builder = await this.postsLikesTypeOrmRepository.createQueryBuilder('pl');
        for (const post of posts) {
            if (post.likesCount === 0)
                return;
            const subQuery = `pl."postId" = :postId AND pl."userId" ${bannedUsers.length ? `NOT IN (:...bannedUsers)` : `IS NOT NULL`} AND pl."likeStatus" = 'Like'`;
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
    async findPostById(postId, userId) {
        const bannedPostsFromUsers = await this.bansRepository.getBannedPosts();
        const bannedPosts = await this.blogBansRepository.getBannedPosts();
        const allBannedPosts = bannedPosts.concat(bannedPostsFromUsers);
        const builder = await this.getBuilder(userId);
        const post = await builder.where('p.id = :postId', { postId: postId }).getRawOne();
        if (!post)
            return null;
        if (allBannedPosts.includes(post.p_id))
            return null;
        await this.findThreeLatestLikesForPosts([post]);
        return this.mapperToPostViewModel(post);
    }
};
PostsQueryRepository = __decorate([
    __param(2, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(3, (0, typeorm_1.InjectRepository)(postLike_entity_1.PostLike)),
    __metadata("design:paramtypes", [bans_repository_1.BansRepository,
        bans_blogs_repository_1.BlogBansRepository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PostsQueryRepository);
exports.PostsQueryRepository = PostsQueryRepository;
//# sourceMappingURL=posts.query-repo.js.map