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
exports.BlogBansRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const saBlogBan_entity_1 = require("./domain/saBlogBan.entity");
let BlogBansRepository = class BlogBansRepository {
    constructor(dataSource, banTypeOrmRepository) {
        this.dataSource = dataSource;
        this.banTypeOrmRepository = banTypeOrmRepository;
    }
    async countBannedBlogs() {
        return await this.banTypeOrmRepository.count({});
    }
    async getBannedBlogs() {
        const bannedUsersCount = await this.countBannedBlogs();
        if (!bannedUsersCount)
            return [];
        const allBans = await this.banTypeOrmRepository.find({});
        const bannedBlogs = [];
        allBans.forEach((ban) => {
            bannedBlogs.push(ban.blogId);
        });
        return bannedBlogs;
    }
    async getBannedPosts() {
        const bannedUsersCount = await this.countBannedBlogs();
        if (!bannedUsersCount)
            return [];
        const allBans = await this.banTypeOrmRepository.find({});
        const bannedPosts = [];
        allBans.forEach((ban) => {
            bannedPosts.push(...ban.bannedPostsIds);
        });
        return bannedPosts;
    }
};
BlogBansRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __param(1, (0, typeorm_1.InjectRepository)(saBlogBan_entity_1.SaBlogBan)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository])
], BlogBansRepository);
exports.BlogBansRepository = BlogBansRepository;
//# sourceMappingURL=bans.blogs.repository.js.map