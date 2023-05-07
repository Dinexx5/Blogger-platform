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
exports.BloggerController = void 0;
const common_1 = require("@nestjs/common");
const blogs_service_1 = require("../blogs/blogs.service");
const posts_service_1 = require("../posts/posts.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const blogs_models_1 = require("../blogs/blogs.models");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const blogs_query_repo_1 = require("../blogs/blogs.query-repo");
const blogger_comments_query_repo_1 = require("./blogger.comments.query-repo");
const param_blogId_integer_guard_1 = require("../auth/guards/param.blogId.integer.guard");
const param_postId_isinteger_guard_1 = require("../auth/guards/param.postId.isinteger.guard");
const posts_models_1 = require("../posts/posts.models");
let BloggerController = class BloggerController {
    constructor(blogsService, postsService, blogsQueryRepo, bloggerCommentsQueryRepo) {
        this.blogsService = blogsService;
        this.postsService = postsService;
        this.blogsQueryRepo = blogsQueryRepo;
        this.bloggerCommentsQueryRepo = bloggerCommentsQueryRepo;
    }
    async getBlogs(paginationQuery, userId) {
        const returnedBlogs = await this.blogsQueryRepo.getAllBlogs(paginationQuery, userId);
        return returnedBlogs;
    }
    async getComments(paginationQuery, userId) {
        const returnedComments = await this.bloggerCommentsQueryRepo.getAllComments(paginationQuery, userId);
        return returnedComments;
    }
    async createBlog(inputModel, userId) {
        const createdInstance = await this.blogsService.createBlog(inputModel, userId);
        return createdInstance;
    }
    async updateBlog(inputModel, params, res, userId) {
        await this.blogsService.UpdateBlogById(inputModel, params.blogId, userId);
        return res.sendStatus(204);
    }
    async deleteBlog(params, res, userId) {
        await this.blogsService.deleteBlogById(params.blogId, userId);
        return res.sendStatus(204);
    }
    async createPost(inputModel, params, res, userId) {
        const post = await this.postsService.createPost(inputModel, params.blogId, userId);
        return res.send(post);
    }
    async updatePost(inputModel, params, res, userId) {
        await this.postsService.updatePostById(inputModel, params.postId, params.blogId, userId);
        return res.sendStatus(204);
    }
    async deletePost(params, res, userId) {
        await this.postsService.deletePostById(+params.postId, +params.blogId, userId);
        return res.sendStatus(204);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BloggerController.prototype, "getBlogs", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard),
    (0, common_1.Get)('/comments'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BloggerController.prototype, "getComments", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [blogs_models_1.createBlogModel, Object]),
    __metadata("design:returntype", Promise)
], BloggerController.prototype, "createBlog", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard, param_blogId_integer_guard_1.isBlogIdIntegerGuard),
    (0, common_1.Put)(':blogId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [blogs_models_1.updateBlogModel,
        blogs_models_1.blogParamModel, Object, Object]),
    __metadata("design:returntype", Promise)
], BloggerController.prototype, "updateBlog", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard, param_blogId_integer_guard_1.isBlogIdIntegerGuard),
    (0, common_1.Delete)(':blogId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [blogs_models_1.blogParamModel, Object, Object]),
    __metadata("design:returntype", Promise)
], BloggerController.prototype, "deleteBlog", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard, param_blogId_integer_guard_1.isBlogIdIntegerGuard),
    (0, common_1.Post)(':blogId/posts'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [posts_models_1.createPostModel,
        blogs_models_1.blogParamModel, Object, Object]),
    __metadata("design:returntype", Promise)
], BloggerController.prototype, "createPost", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard, param_blogId_integer_guard_1.isBlogIdIntegerGuard, param_postId_isinteger_guard_1.isPostIdIntegerGuard),
    (0, common_1.Put)(':blogId/posts/:postId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [posts_models_1.updatePostModel,
        blogs_models_1.blogAndPostParamModel, Object, Object]),
    __metadata("design:returntype", Promise)
], BloggerController.prototype, "updatePost", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard, param_blogId_integer_guard_1.isBlogIdIntegerGuard, param_postId_isinteger_guard_1.isPostIdIntegerGuard),
    (0, common_1.Delete)(':blogId/posts/:postId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [blogs_models_1.blogAndPostParamModel, Object, Object]),
    __metadata("design:returntype", Promise)
], BloggerController.prototype, "deletePost", null);
BloggerController = __decorate([
    (0, common_1.Controller)('blogger/blogs'),
    __metadata("design:paramtypes", [blogs_service_1.BlogsService,
        posts_service_1.PostsService,
        blogs_query_repo_1.BlogsQueryRepository,
        blogger_comments_query_repo_1.BloggerCommentsQueryRepository])
], BloggerController);
exports.BloggerController = BloggerController;
//# sourceMappingURL=blogger.controller.js.map