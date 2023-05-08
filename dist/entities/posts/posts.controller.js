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
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
const posts_service_1 = require("./posts.service");
const posts_query_repo_1 = require("./posts.query-repo");
const comments_query_repo_1 = require("../comments/comments.query-repo");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const getuser_guard_1 = require("../auth/guards/getuser.guard");
const comments_models_1 = require("../comments/comments.models");
const param_postId_isinteger_guard_1 = require("../auth/guards/param.postId.isinteger.guard");
let PostsController = class PostsController {
    constructor(postsService, postsQueryRepository, commentsQueryRepository) {
        this.postsService = postsService;
        this.postsQueryRepository = postsQueryRepository;
        this.commentsQueryRepository = commentsQueryRepository;
    }
    async getPosts(userId, paginationQuery) {
        const returnedPosts = await this.postsQueryRepository.getAllPosts(paginationQuery, undefined, userId);
        return returnedPosts;
    }
    async getPost(userId, postId, res) {
        const post = await this.postsQueryRepository.findPostById(postId, userId);
        if (!post) {
            return res.sendStatus(404);
        }
        return res.send(post);
    }
    async getComments(userId, postId, paginationQuery, res) {
        const foundPost = await this.postsQueryRepository.findPostById(postId);
        if (!foundPost) {
            return res.sendStatus(404);
        }
        const returnedComments = await this.commentsQueryRepository.getAllCommentsForPost(paginationQuery, postId, userId);
        return res.send(returnedComments);
    }
    async createComment(userId, postId, inputModel, res) {
        const newComment = await this.postsService.createComment(postId, inputModel, userId);
        if (!newComment)
            return res.sendStatus(404);
        return res.status(201).send(newComment);
    }
    async likePost(userId, postId, inputModel, res) {
        const isLiked = await this.postsService.likePost(postId, inputModel.likeStatus, userId);
        if (!isLiked)
            return res.sendStatus(404);
        return res.sendStatus(204);
    }
};
__decorate([
    (0, common_1.UseGuards)(getuser_guard_1.GetUserGuard),
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPosts", null);
__decorate([
    (0, common_1.UseGuards)(getuser_guard_1.GetUserGuard, param_postId_isinteger_guard_1.isPostIdIntegerGuard),
    (0, common_1.Get)(':postId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPost", null);
__decorate([
    (0, common_1.UseGuards)(getuser_guard_1.GetUserGuard, param_postId_isinteger_guard_1.isPostIdIntegerGuard),
    (0, common_1.Get)(':postId/comments'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getComments", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard, param_postId_isinteger_guard_1.isPostIdIntegerGuard),
    (0, common_1.Post)(':postId/comments'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, comments_models_1.UpdateCommentModel, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "createComment", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard, param_postId_isinteger_guard_1.isPostIdIntegerGuard),
    (0, common_1.Put)('/:postId/like-status'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, comments_models_1.LikeInputModel, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "likePost", null);
PostsController = __decorate([
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [posts_service_1.PostsService,
        posts_query_repo_1.PostsQueryRepository,
        comments_query_repo_1.CommentsQueryRepository])
], PostsController);
exports.PostsController = PostsController;
//# sourceMappingURL=posts.controller.js.map