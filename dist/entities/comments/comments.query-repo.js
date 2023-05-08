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
exports.CommentsQueryRepository = void 0;
const bans_repository_1 = require("../bans/bans.repository");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("./domain/comment.entity");
let CommentsQueryRepository = class CommentsQueryRepository {
    constructor(bansRepository, commentsTypeOrmRepository) {
        this.bansRepository = bansRepository;
        this.commentsTypeOrmRepository = commentsTypeOrmRepository;
    }
    mapperToCommentViewModel(comment) {
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
    async getAllCommentsForPost(query, postId, userId) {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = query;
        const skippedCommentsCount = (+pageNumber - 1) * +pageSize;
        const sortDirectionSql = sortDirection === 'desc' ? 'DESC' : 'ASC';
        const bannedComments = await this.bansRepository.getBannedComments();
        const builder = await this.getBuilder(userId);
        const orderQuery = `CASE WHEN c."${sortBy}" = LOWER(c."${sortBy}") THEN 2
         ELSE 1 END, c."${sortBy}"`;
        const subQuery = `c.id ${bannedComments.length ? `NOT IN (:...bannedComments)` : `IS NOT NULL`} AND pi.postId = :postId`;
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
    async getBuilder(userId) {
        const bannedUsers = await this.bansRepository.getBannedUsers();
        return this.commentsTypeOrmRepository
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.commentatorInfo', 'ci')
            .leftJoinAndSelect('c.postInfo', 'pi')
            .leftJoin('c.likes', 'l')
            .addSelect([
            `(select COUNT(*) FROM comment_like where l."commentId" = c."id"
         AND l."likeStatus" = 'Like'
         AND ${bannedUsers.length ? `l."userId" NOT IN (${bannedUsers})` : 'true'}) as "likesCount"`,
        ])
            .addSelect([
            `(select COUNT(*) FROM comment_like where l."commentId" = c."id"
         AND l."likeStatus" = 'Dislike'
         AND ${bannedUsers.length ? `l."userId" NOT IN (${bannedUsers})` : 'true'}) as "dislikesCount"`,
        ])
            .addSelect([
            `(${userId
                ? `select l."likeStatus" FROM comment_like where l."commentId" = c."id"
                AND l."userId" = ${userId}`
                : 'false'}) as "myStatus"`,
        ]);
    }
    async findCommentById(commentId, userId) {
        const bannedComments = await this.bansRepository.getBannedComments();
        const builder = await this.getBuilder(userId);
        const comment = await builder.where('c.id = :commentId', { commentId: commentId }).getRawOne();
        if (!comment)
            return null;
        if (bannedComments.includes(comment.c_id))
            return null;
        return this.mapperToCommentViewModel(comment);
    }
};
CommentsQueryRepository = __decorate([
    __param(1, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [bans_repository_1.BansRepository,
        typeorm_2.Repository])
], CommentsQueryRepository);
exports.CommentsQueryRepository = CommentsQueryRepository;
//# sourceMappingURL=comments.query-repo.js.map