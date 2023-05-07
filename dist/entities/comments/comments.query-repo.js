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
const comments_likes_repository_1 = require("../likes/comments.likes.repository");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let CommentsQueryRepository = class CommentsQueryRepository {
    constructor(bansRepository, commentsLikesRepository, dataSource) {
        this.bansRepository = bansRepository;
        this.commentsLikesRepository = commentsLikesRepository;
        this.dataSource = dataSource;
    }
    mapperToCommentViewModel(comment) {
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
    async getAllCommentsForPost(query, postId, userId) {
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
    async countLikesForComments(comments, userId) {
        for (const comment of comments) {
            const foundLikes = await this.commentsLikesRepository.findLikesForComment(comment.id.toString());
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
    async countLikesForComment(comment, userId) {
        const foundLikes = await this.commentsLikesRepository.findLikesForComment(comment.id.toString());
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
    async findCommentById(commentId, userId) {
        const bannedComments = await this.bansRepository.getBannedComments();
        const bannedCommentsStrings = bannedComments.map((commentId) => commentId.toString());
        const foundComment = await this.dataSource.query(`
          SELECT c.*, pi."postId", ci."userId", ci."userLogin"
                    FROM "Comments" c 
                    LEFT JOIN "PostInfoForComment" pi
                    ON c."id" = pi."commentId"
                    LEFT JOIN "CommentatorInfo" ci
                    ON c."id" = ci."commentId"
          WHERE "id" = $1
      `, [commentId]);
        if (!foundComment.length) {
            return null;
        }
        if (bannedCommentsStrings.includes(foundComment[0].id.toString())) {
            return null;
        }
        await this.countLikesForComment(foundComment[0], userId);
        return this.mapperToCommentViewModel(foundComment[0]);
    }
};
CommentsQueryRepository = __decorate([
    __param(2, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [bans_repository_1.BansRepository,
        comments_likes_repository_1.CommentsLikesRepository,
        typeorm_2.DataSource])
], CommentsQueryRepository);
exports.CommentsQueryRepository = CommentsQueryRepository;
//# sourceMappingURL=comments.query-repo.js.map