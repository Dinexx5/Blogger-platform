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
exports.SuperAdminBlogsController = void 0;
const common_1 = require("@nestjs/common");
const blogs_models_1 = require("./blogs.models");
const sa_blogs_service_1 = require("./sa.blogs.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
const sa_blog_query_repo_1 = require("./sa.blog.query-repo");
const cqrs_1 = require("@nestjs/cqrs");
const ban_blog_use_case_1 = require("./application/use-cases/ban.blog.use-case");
let SuperAdminBlogsController = class SuperAdminBlogsController {
    constructor(commandBus, superAdminBlogsQueryRepository, superAdminBlogService) {
        this.commandBus = commandBus;
        this.superAdminBlogsQueryRepository = superAdminBlogsQueryRepository;
        this.superAdminBlogService = superAdminBlogService;
    }
    async getBlogs(paginationQuery) {
        const returnedBlogs = await this.superAdminBlogsQueryRepository.getAllBlogs(paginationQuery);
        return returnedBlogs;
    }
    async bindBlog(params, res) {
        await this.superAdminBlogService.bindBlog(params.blogId, params.userId);
        return res.sendStatus(204);
    }
    async banBlog(params, inputModel, res) {
        await this.commandBus.execute(new ban_blog_use_case_1.BanBlogCommand(params.blogId, inputModel));
        return res.sendStatus(204);
    }
};
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuperAdminBlogsController.prototype, "getBlogs", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)(':blogId/bind-with-user/:userId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [blogs_models_1.blogAndUserParamModel, Object]),
    __metadata("design:returntype", Promise)
], SuperAdminBlogsController.prototype, "bindBlog", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)(':blogId/ban'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [blogs_models_1.blogParamModel,
        blogs_models_1.BanBlogModel, Object]),
    __metadata("design:returntype", Promise)
], SuperAdminBlogsController.prototype, "banBlog", null);
SuperAdminBlogsController = __decorate([
    (0, common_1.Controller)('sa/blogs'),
    __metadata("design:paramtypes", [cqrs_1.CommandBus,
        sa_blog_query_repo_1.BlogsSAQueryRepository,
        sa_blogs_service_1.SuperAdminBlogsService])
], SuperAdminBlogsController);
exports.SuperAdminBlogsController = SuperAdminBlogsController;
//# sourceMappingURL=sa.blogs.controller.js.map