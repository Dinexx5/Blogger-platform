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
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const comments_query_repo_1 = require("./comments.query-repo");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const comments_service_1 = require("./comments.service");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const getuser_guard_1 = require("../auth/guards/getuser.guard");
const comments_models_1 = require("./comments.models");
const param_commentid_isinteger_1 = require("../auth/guards/param.commentid.isinteger");
let CommentsController = class CommentsController {
    constructor(commentsQueryRepository, commentsService) {
        this.commentsQueryRepository = commentsQueryRepository;
        this.commentsService = commentsService;
    }
    async getComment(userId, id, res) {
        const comment = await this.commentsQueryRepository.findCommentById(id, userId);
        if (!comment)
            return res.sendStatus(404);
        return res.send(comment);
    }
    async updateComment(userId, commentId, inputModel, res) {
        await this.commentsService.updateCommentById(commentId, inputModel, userId);
        return res.sendStatus(204);
    }
    async deleteComment(userId, commentId, res) {
        await this.commentsService.deleteCommentById(commentId, userId);
        return res.sendStatus(204);
    }
    async likeComment(userId, commentId, inputModel, res) {
        const isLiked = await this.commentsService.likeComment(commentId, inputModel.likeStatus, userId);
        if (!isLiked)
            return res.sendStatus(404);
        return res.sendStatus(204);
    }
};
__decorate([
    (0, common_1.UseGuards)(getuser_guard_1.GetUserGuard, param_commentid_isinteger_1.isCommentIdIntegerGuard),
    (0, common_1.Get)(':commentId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('commentId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "getComment", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard, param_commentid_isinteger_1.isCommentIdIntegerGuard),
    (0, common_1.Put)(':commentId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, comments_models_1.UpdateCommentModel, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "updateComment", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard, param_commentid_isinteger_1.isCommentIdIntegerGuard),
    (0, common_1.Delete)(':commentId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard, param_commentid_isinteger_1.isCommentIdIntegerGuard),
    (0, common_1.Put)('/:commentId/like-status'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, comments_models_1.LikeInputModel, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "likeComment", null);
CommentsController = __decorate([
    (0, common_1.Controller)('comments'),
    __metadata("design:paramtypes", [comments_query_repo_1.CommentsQueryRepository,
        comments_service_1.CommentsService])
], CommentsController);
exports.CommentsController = CommentsController;
//# sourceMappingURL=comments.controller.js.map