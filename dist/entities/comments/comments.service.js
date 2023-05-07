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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const comments_repository_1 = require("./comments.repository");
const users_repository_1 = require("../users/users.repository");
const posts_repository_1 = require("../posts/posts.repository");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("./domain/comment.entity");
const commentatorInfo_entity_1 = require("./domain/commentatorInfo.entity");
const postInfo_entity_1 = require("./domain/postInfo.entity");
const commentLike_entity_1 = require("../likes/domain/commentLike.entity");
let CommentsService = class CommentsService {
    constructor(commentsRepository, postsRepository, usersRepository, commentsTypeOrmRepository, commentatorInfoRepository, postInfoRepository, commentsLikesRepository) {
        this.commentsRepository = commentsRepository;
        this.postsRepository = postsRepository;
        this.usersRepository = usersRepository;
        this.commentsTypeOrmRepository = commentsTypeOrmRepository;
        this.commentatorInfoRepository = commentatorInfoRepository;
        this.postInfoRepository = postInfoRepository;
        this.commentsLikesRepository = commentsLikesRepository;
    }
    async createComment(postId, inputModel, userId) {
        const user = await this.usersRepository.findUserById(userId);
        const post = await this.postsRepository.findPostInstance(postId);
        const createdAt = new Date().toISOString();
        const comment = await this.commentsTypeOrmRepository.create();
        comment.content = inputModel.content;
        comment.createdAt = createdAt;
        await this.commentsTypeOrmRepository.save(comment);
        const commentatorInfo = await this.commentatorInfoRepository.create();
        commentatorInfo.commentId = comment.id;
        commentatorInfo.userId = user.id;
        commentatorInfo.userLogin = user.login;
        await this.commentatorInfoRepository.save(commentatorInfo);
        const postInfo = await this.postInfoRepository.create();
        postInfo.commentId = comment.id;
        postInfo.postId = post.id;
        postInfo.title = post.title;
        postInfo.blogId = post.blogId;
        postInfo.blogName = post.blogName;
        await this.postInfoRepository.save(postInfo);
        return {
            id: comment.id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: userId.toString(),
                userLogin: user.login,
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
            },
        };
    }
    async updateCommentById(commentId, inputModel, userId) {
        const comment = await this.commentsRepository.findComment(commentId);
        if (!comment)
            throw new common_1.NotFoundException();
        const commentatorInfo = await this.commentatorInfoRepository.findOneBy({
            commentId: commentId,
        });
        if (commentatorInfo.userId !== userId)
            throw new common_1.ForbiddenException();
        comment.content = inputModel.content;
        await this.commentsTypeOrmRepository.save(comment);
    }
    async deleteCommentById(commentId, userId) {
        const comment = await this.commentsRepository.findComment(commentId);
        if (!comment)
            throw new common_1.NotFoundException();
        const commentatorInfo = await this.commentatorInfoRepository.findOneBy({
            commentId: commentId,
        });
        if (commentatorInfo.userId !== userId)
            throw new common_1.ForbiddenException();
        await this.commentatorInfoRepository.remove(commentatorInfo);
        await this.postInfoRepository.delete({ commentId: commentId });
        await this.commentsTypeOrmRepository.remove(comment);
    }
    async likeComment(commentId, likeStatus, userId) {
        const comment = await this.commentsRepository.findComment(commentId);
        if (!comment)
            return false;
        const like = await this.commentsLikesRepository.findOneBy({
            commentId: commentId,
            userId: userId,
        });
        if (!like) {
            const createdAt = new Date().toISOString();
            const newLike = await this.commentsLikesRepository.create();
            newLike.commentId = commentId;
            newLike.likeStatus = likeStatus;
            newLike.userId = userId;
            newLike.createdAt = createdAt;
            await this.commentsLikesRepository.save(newLike);
            return true;
        }
        like.likeStatus = likeStatus;
        await this.commentsLikesRepository.save(like);
        return true;
    }
};
CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(4, (0, typeorm_1.InjectRepository)(commentatorInfo_entity_1.CommentatorInfo)),
    __param(5, (0, typeorm_1.InjectRepository)(postInfo_entity_1.PostInfoForComment)),
    __param(6, (0, typeorm_1.InjectRepository)(commentLike_entity_1.CommentLike)),
    __metadata("design:paramtypes", [comments_repository_1.CommentsRepository,
        posts_repository_1.PostsRepository,
        users_repository_1.UsersRepository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CommentsService);
exports.CommentsService = CommentsService;
//# sourceMappingURL=comments.service.js.map