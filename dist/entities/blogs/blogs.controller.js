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
exports.BlogsController = void 0;
const common_1 = require("@nestjs/common");
const blogs_query_repo_1 = require("./blogs.query-repo");
const posts_query_repo_1 = require("../posts/posts.query-repo");
const getuser_guard_1 = require("../auth/guards/getuser.guard");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const param_blogId_integer_guard_1 = require("../auth/guards/param.blogId.integer.guard");
let BlogsController = class BlogsController {
    constructor(blogsQueryRepository, postsQueryRepository) {
        this.blogsQueryRepository = blogsQueryRepository;
        this.postsQueryRepository = postsQueryRepository;
    }
    async getBlogs(paginationQuery) {
        const returnedBlogs = await this.blogsQueryRepository.getAllBlogs(paginationQuery);
        return returnedBlogs;
    }
    async getBlog(id, res) {
        const blog = await this.blogsQueryRepository.findBlogById(id);
        if (!blog) {
            return res.sendStatus(404);
        }
        return res.send(blog);
    }
    async getPosts(userId, blogId, paginationQuery, res) {
        const blog = await this.blogsQueryRepository.findBlogById(blogId);
        if (!blog)
            return res.sendStatus(404);
        const returnedPosts = await this.postsQueryRepository.getAllPosts(paginationQuery, blogId, userId);
        return res.send(returnedPosts);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getBlogs", null);
__decorate([
    (0, common_1.UseGuards)(param_blogId_integer_guard_1.isBlogIdIntegerGuard),
    (0, common_1.Get)(':blogId'),
    __param(0, (0, common_1.Param)('blogId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getBlog", null);
__decorate([
    (0, common_1.UseGuards)(getuser_guard_1.GetUserGuard, param_blogId_integer_guard_1.isBlogIdIntegerGuard),
    (0, common_1.Get)(':blogId/posts'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('blogId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getPosts", null);
BlogsController = __decorate([
    (0, common_1.Controller)('blogs'),
    __metadata("design:paramtypes", [blogs_query_repo_1.BlogsQueryRepository,
        posts_query_repo_1.PostsQueryRepository])
], BlogsController);
exports.BlogsController = BlogsController;
//# sourceMappingURL=blogs.controller.js.map