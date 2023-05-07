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
exports.BlogsService = void 0;
const blogs_repository_1 = require("./blogs.repository");
const common_1 = require("@nestjs/common");
const users_repository_1 = require("../users/users.repository");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const blog_entity_1 = require("./domain/blog.entity");
const blogBansInfo_entity_1 = require("./domain/blogBansInfo.entity");
const blogOwner_entity_1 = require("./domain/blogOwner.entity");
let BlogsService = class BlogsService {
    constructor(blogsRepository, usersRepository, blogsTypeOrmRepository, blogBanInfoRepository, blogOwnerInfoRepository) {
        this.blogsRepository = blogsRepository;
        this.usersRepository = usersRepository;
        this.blogsTypeOrmRepository = blogsTypeOrmRepository;
        this.blogBanInfoRepository = blogBanInfoRepository;
        this.blogOwnerInfoRepository = blogOwnerInfoRepository;
    }
    async createBlog(inputModel, userId) {
        const user = await this.usersRepository.findUserById(userId);
        const isMembership = false;
        const createdAt = new Date().toISOString();
        const blog = await this.blogsTypeOrmRepository.create();
        blog.name = inputModel.name;
        blog.description = inputModel.description;
        blog.websiteUrl = inputModel.websiteUrl;
        blog.isMembership = isMembership;
        blog.createdAt = createdAt;
        await this.blogsTypeOrmRepository.save(blog);
        const blogBanInfo = await this.blogBanInfoRepository.create();
        blogBanInfo.blogId = blog.id;
        blogBanInfo.isBanned = false;
        blogBanInfo.banDate = null;
        await this.blogBanInfoRepository.save(blogBanInfo);
        const blogOwnerInfo = await this.blogOwnerInfoRepository.create();
        blogOwnerInfo.blogId = blog.id;
        blogOwnerInfo.userId = userId;
        blogOwnerInfo.userLogin = user.login;
        await this.blogOwnerInfoRepository.save(blogOwnerInfo);
        return {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            isMembership: blog.isMembership,
            createdAt: blog.createdAt,
            id: blog.id.toString(),
        };
    }
    async deleteBlogById(blogId, userId) {
        const blog = await this.blogsRepository.findBlogById(blogId);
        if (!blog)
            throw new common_1.NotFoundException();
        const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
        if (blogOwnerInfo.userId !== userId)
            throw new common_1.ForbiddenException();
        await this.blogOwnerInfoRepository.remove(blogOwnerInfo);
        await this.blogBanInfoRepository.delete({ blogId: blogId });
        await this.blogsTypeOrmRepository.remove(blog);
    }
    async UpdateBlogById(blogBody, blogId, userId) {
        const { name, description, websiteUrl } = blogBody;
        const blog = await this.blogsRepository.findBlogById(blogId);
        const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
        if (!blog)
            throw new common_1.NotFoundException();
        if (blogOwnerInfo.userId !== userId)
            throw new common_1.ForbiddenException();
        blog.name = name;
        blog.description = description;
        blog.websiteUrl = websiteUrl;
        await this.blogsTypeOrmRepository.save(blog);
    }
};
BlogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(blog_entity_1.Blog)),
    __param(3, (0, typeorm_1.InjectRepository)(blogBansInfo_entity_1.BlogBansInfo)),
    __param(4, (0, typeorm_1.InjectRepository)(blogOwner_entity_1.BlogOwnerInfo)),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository,
        users_repository_1.UsersRepository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BlogsService);
exports.BlogsService = BlogsService;
//# sourceMappingURL=blogs.service.js.map