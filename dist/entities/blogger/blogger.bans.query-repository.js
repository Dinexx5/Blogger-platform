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
exports.BloggerBansQueryRepository = void 0;
const common_1 = require("@nestjs/common");
const blogs_repository_1 = require("../blogs/blogs.repository");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const blogOwner_entity_1 = require("../blogs/domain/blogOwner.entity");
const userBanForBlog_entity_1 = require("./domain/userBanForBlog.entity");
let BloggerBansQueryRepository = class BloggerBansQueryRepository {
    constructor(blogsRepository, blogOwnerInfoRepository, userBansTypeOrmRepository) {
        this.blogsRepository = blogsRepository;
        this.blogOwnerInfoRepository = blogOwnerInfoRepository;
        this.userBansTypeOrmRepository = userBansTypeOrmRepository;
    }
    mapFoundBansToViewModel(ban) {
        return {
            id: ban.userId.toString(),
            login: ban.login,
            banInfo: {
                isBanned: ban.isBanned,
                banDate: ban.banDate,
                banReason: ban.banReason,
            },
        };
    }
    async getAllBannedUsersForBlog(query, blogId, userId) {
        const { sortDirection = 'desc', sortBy = 'login', pageNumber = 1, pageSize = 10, searchLoginTerm = null, } = query;
        const skippedBlogsCount = (+pageNumber - 1) * +pageSize;
        const sortDirectionSql = sortDirection === 'desc' ? 'DESC' : 'ASC';
        const blog = await this.blogsRepository.findBlogById(blogId);
        if (!blog)
            throw new common_1.NotFoundException();
        const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
        if (blogOwnerInfo.userId !== userId)
            throw new common_1.ForbiddenException();
        const subQuery = `ub.blogId = :blogId AND ${searchLoginTerm ? 'LOWER(ub.login) LIKE LOWER(:searchLoginTerm)' : 'true'}`;
        const orderQuery = `CASE WHEN "${sortBy}" = LOWER("${sortBy}") THEN 2
         ELSE 1 END, "${sortBy}"`;
        const builder = this.userBansTypeOrmRepository
            .createQueryBuilder('ub')
            .where(subQuery, { blogId: blogId, searchLoginTerm: `%${searchLoginTerm}%` });
        const bans = await builder
            .orderBy(orderQuery, sortDirectionSql)
            .limit(+pageSize)
            .offset(skippedBlogsCount)
            .getMany();
        const count = await builder.getCount();
        const bansView = bans.map(this.mapFoundBansToViewModel);
        return {
            pagesCount: Math.ceil(+count / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +count,
            items: bansView,
        };
    }
};
BloggerBansQueryRepository = __decorate([
    __param(1, (0, typeorm_1.InjectRepository)(blogOwner_entity_1.BlogOwnerInfo)),
    __param(2, (0, typeorm_1.InjectRepository)(userBanForBlog_entity_1.UserBanForBlog)),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BloggerBansQueryRepository);
exports.BloggerBansQueryRepository = BloggerBansQueryRepository;
//# sourceMappingURL=blogger.bans.query-repository.js.map