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
exports.BansRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const saUserBan_entity_1 = require("./domain/saUserBan.entity");
let BansRepository = class BansRepository {
    constructor(banTypeOrmRepository) {
        this.banTypeOrmRepository = banTypeOrmRepository;
    }
    async isUserBanned(userId) {
        const ban = await this.banTypeOrmRepository.findOneBy({ userId: userId });
        if (ban)
            return true;
        return false;
    }
    async countBannedUsers() {
        return await this.banTypeOrmRepository.count({});
    }
    async getBannedUsers() {
        const allBans = await this.banTypeOrmRepository.find({});
        const bannedUsers = [];
        allBans.forEach((ban) => {
            bannedUsers.push(ban.userId);
        });
        return bannedUsers;
    }
    async getBannedBlogs() {
        const bannedUsersCount = await this.countBannedUsers();
        if (!bannedUsersCount)
            return [];
        const allBans = await this.banTypeOrmRepository.find({});
        const bannedBlogs = [];
        allBans.forEach((ban) => {
            bannedBlogs.push(...ban.bannedBlogsIds);
        });
        return bannedBlogs;
    }
    async getBannedPosts() {
        const bannedUsersCount = await this.countBannedUsers();
        if (!bannedUsersCount)
            return [];
        const allBans = await this.banTypeOrmRepository.find({});
        const bannedPosts = [];
        allBans.forEach((ban) => {
            bannedPosts.push(...ban.bannedPostsIds);
        });
        return bannedPosts;
    }
    async getBannedComments() {
        const bannedUsersCount = await this.countBannedUsers();
        if (!bannedUsersCount)
            return [];
        const allBans = await this.banTypeOrmRepository.find({});
        const bannedComments = [];
        allBans.forEach((ban) => {
            bannedComments.push(...ban.bannedCommentsIds);
        });
        return bannedComments;
    }
};
BansRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(saUserBan_entity_1.SaUserBan)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BansRepository);
exports.BansRepository = BansRepository;
//# sourceMappingURL=bans.repository.js.map