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
exports.BloggerUsersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const userModels_1 = require("../users/userModels");
const cqrs_1 = require("@nestjs/cqrs");
const ban_user_for_blog_use_case_1 = require("./application/use-cases/ban.user.for.blog.use-case");
const blogs_models_1 = require("../blogs/blogs.models");
const blogger_bans_query_repository_1 = require("./blogger.bans.query-repository");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const param_integer_guard_1 = require("../auth/guards/param.integer.guard");
const param_blogId_integer_guard_1 = require("../auth/guards/param.blogId.integer.guard");
let BloggerUsersController = class BloggerUsersController {
    constructor(commandBus, bloggerQueryRepository) {
        this.commandBus = commandBus;
        this.bloggerQueryRepository = bloggerQueryRepository;
    }
    async banUser(ownerId, param, inputModel, res) {
        await this.commandBus.execute(new ban_user_for_blog_use_case_1.BanUserForBlogCommand(param.userId, inputModel, ownerId));
        return res.sendStatus(204);
    }
    async getBannedUsers(userId, paginationQuery, param) {
        const returnedUsers = await this.bloggerQueryRepository.getAllBannedUsersForBlog(paginationQuery, param.blogId, userId);
        return returnedUsers;
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard, param_integer_guard_1.isUserIdIntegerGuard),
    (0, common_1.Put)(':userId/ban'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, userModels_1.UserToBanParamModel,
        userModels_1.BanUserModelForBlog, Object]),
    __metadata("design:returntype", Promise)
], BloggerUsersController.prototype, "banUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard, param_blogId_integer_guard_1.isBlogIdIntegerGuard),
    (0, common_1.Get)('/blog/:blogId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, blogs_models_1.blogParamModel]),
    __metadata("design:returntype", Promise)
], BloggerUsersController.prototype, "getBannedUsers", null);
BloggerUsersController = __decorate([
    (0, common_1.Controller)('blogger/users'),
    __metadata("design:paramtypes", [cqrs_1.CommandBus,
        blogger_bans_query_repository_1.BloggerBansQueryRepository])
], BloggerUsersController);
exports.BloggerUsersController = BloggerUsersController;
//# sourceMappingURL=blogger.users.controller.js.map