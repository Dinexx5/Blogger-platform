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
exports.BloggerCommentsQueryRepository = void 0;
const blogs_repository_1 = require("../blogs/blogs.repository");
const posts_repository_1 = require("../posts/posts.repository");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("../comments/domain/comment.entity");
let BloggerCommentsQueryRepository = class BloggerCommentsQueryRepository {
    constructor(blogsRepository, postsRepository, commentsTypeOrmRepository) {
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
        this.commentsTypeOrmRepository = commentsTypeOrmRepository;
    }
    mapCommentsToViewModel(comment) {
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
    async getAllComments(query, userId) {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = query;
        const skippedCommentsCount = (+pageNumber - 1) * +pageSize;
        const allBlogs = await this.blogsRepository.findBlogsForUser(userId);
        const allPosts = await this.postsRepository.findPostsForUser(allBlogs);
        const sortDirectionSql = sortDirection === 'desc' ? 'DESC' : 'ASC';
        const subQuery = `${allPosts.length ? `pi.postId IN (:...allPosts)` : `false`}`;
        const orderQuery = `CASE WHEN "${sortBy}" = LOWER("${sortBy}") THEN 2
         ELSE 1 END`;
        const builder = this.commentsTypeOrmRepository
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.commentatorInfo', 'ci')
            .leftJoinAndSelect('c.postInfo', 'pi')
            .leftJoin('c.likes', 'l')
            .addSelect([
            `(select COUNT(*) FROM comment_like where l."commentId" = c."id"
         AND l."likeStatus" = 'Like') as "likesCount"`,
        ])
            .addSelect([
            `(select COUNT(*) FROM comment_like where l."commentId" = c."id"
         AND l."likeStatus" = 'Dislike') as "dislikesCount"`,
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
};
BloggerCommentsQueryRepository = __decorate([
    __param(2, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository,
        posts_repository_1.PostsRepository,
        typeorm_2.Repository])
], BloggerCommentsQueryRepository);
exports.BloggerCommentsQueryRepository = BloggerCommentsQueryRepository;
//# sourceMappingURL=blogger.comments.query-repo.js.map