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
exports.BlogsQueryRepository = void 0;
const bans_repository_1 = require("../bans/bans.repository");
const bans_blogs_repository_1 = require("../bans/bans.blogs.repository");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const blog_entity_1 = require("./domain/blog.entity");
let BlogsQueryRepository = class BlogsQueryRepository {
    constructor(bansRepository, blogBansRepository, blogsTypeOrmRepository) {
        this.bansRepository = bansRepository;
        this.blogBansRepository = blogBansRepository;
        this.blogsTypeOrmRepository = blogsTypeOrmRepository;
    }
    mapFoundBlogToBlogViewModel(blog) {
        return {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            isMembership: blog.isMembership,
            createdAt: blog.createdAt,
            id: blog.id.toString(),
        };
    }
    async getAllBlogs(query, userId) {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10, searchNameTerm = null, } = query;
        const skippedBlogsCount = (+pageNumber - 1) * +pageSize;
        const bannedBlogsFromUsers = await this.bansRepository.getBannedBlogs();
        const bannedBlogs = await this.blogBansRepository.getBannedBlogs();
        const allBannedBlogs = bannedBlogs.concat(bannedBlogsFromUsers);
        const builder = this.blogsTypeOrmRepository
            .createQueryBuilder('b')
            .leftJoinAndSelect('b.ownerInfo', 'oi');
        const bannedSubQuery = `${allBannedBlogs.length ? 'b.id NOT IN (:...allBannedBlogs)' : 'b.id IS NOT NULL'}`;
        const userIdSubQuery = `${userId ? 'oi.userId = :userId' : 'true'}`;
        const searchNameTermQuery = `${searchNameTerm ? 'LOWER(b.name) LIKE LOWER(:searchNameTerm)' : 'true'}`;
        const sortDirectionSql = sortDirection === 'desc' ? 'DESC' : 'ASC';
        const blogs = await builder
            .where(bannedSubQuery, { allBannedBlogs: allBannedBlogs })
            .andWhere(userIdSubQuery, { userId: userId })
            .andWhere(searchNameTermQuery, { searchNameTerm: `%${searchNameTerm}%` })
            .orderBy(`b.${sortBy}`, sortDirectionSql)
            .limit(+pageSize)
            .offset(skippedBlogsCount)
            .getMany();
        const count = blogs.length;
        const blogsView = blogs.map(this.mapFoundBlogToBlogViewModel);
        return {
            pagesCount: Math.ceil(+count / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +count,
            items: blogsView,
        };
    }
    async findBlogById(blogId) {
        const bannedBlogsFromUsers = await this.bansRepository.getBannedBlogs();
        const bannedBlogs = await this.blogBansRepository.getBannedBlogs();
        const allBannedBlogs = bannedBlogs.concat(bannedBlogsFromUsers);
        const foundBlog = await this.blogsTypeOrmRepository.findOneBy({ id: blogId });
        if (!foundBlog)
            return null;
        if (allBannedBlogs.includes(foundBlog.id))
            return null;
        return this.mapFoundBlogToBlogViewModel(foundBlog);
    }
};
BlogsQueryRepository = __decorate([
    __param(2, (0, typeorm_1.InjectRepository)(blog_entity_1.Blog)),
    __metadata("design:paramtypes", [bans_repository_1.BansRepository,
        bans_blogs_repository_1.BlogBansRepository,
        typeorm_2.Repository])
], BlogsQueryRepository);
exports.BlogsQueryRepository = BlogsQueryRepository;
//# sourceMappingURL=blogs.query-repo.js.map