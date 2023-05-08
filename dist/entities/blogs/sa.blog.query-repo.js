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
exports.BlogsSAQueryRepository = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const blog_entity_1 = require("./domain/blog.entity");
let BlogsSAQueryRepository = class BlogsSAQueryRepository {
    constructor(blogsTypeOrmRepository) {
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
            blogOwnerInfo: {
                userId: blog.blogOwnerInfo.userId.toString(),
                userLogin: blog.blogOwnerInfo.userLogin,
            },
            banInfo: {
                isBanned: blog.banInfo.isBanned,
                banDate: blog.banInfo.banDate,
            },
        };
    }
    async getAllBlogs(query) {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10, searchNameTerm = null, } = query;
        const skippedBlogsCount = (+pageNumber - 1) * +pageSize;
        const searchNameTermQuery = `${searchNameTerm ? 'LOWER(b.name) LIKE LOWER(:searchNameTerm)' : 'true'}`;
        const sortDirectionSql = sortDirection === 'desc' ? 'DESC' : 'ASC';
        const orderQuery = `CASE WHEN "${sortBy}" = LOWER("${sortBy}") THEN 2
         ELSE 1 END, "${sortBy}"`;
        const builder = this.blogsTypeOrmRepository
            .createQueryBuilder('b')
            .leftJoinAndSelect('b.blogOwnerInfo', 'oi')
            .leftJoinAndSelect('b.banInfo', 'bi')
            .where(searchNameTermQuery, { searchNameTerm: `%${searchNameTerm}%` });
        const blogs = await builder
            .orderBy(orderQuery, sortDirectionSql)
            .limit(+pageSize)
            .offset(skippedBlogsCount)
            .getMany();
        const count = await builder.getCount();
        const blogsView = blogs.map(this.mapFoundBlogToBlogViewModel);
        return {
            pagesCount: Math.ceil(+count / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +count,
            items: blogsView,
        };
    }
};
BlogsSAQueryRepository = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(blog_entity_1.Blog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BlogsSAQueryRepository);
exports.BlogsSAQueryRepository = BlogsSAQueryRepository;
//# sourceMappingURL=sa.blog.query-repo.js.map