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
exports.PostsLikesRepository = void 0;
const common_1 = require("@nestjs/common");
const bans_repository_1 = require("../bans/bans.repository");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let PostsLikesRepository = class PostsLikesRepository {
    constructor(bansRepository, dataSource) {
        this.bansRepository = bansRepository;
        this.dataSource = dataSource;
    }
    async findLikesForPost(postId) {
        const bannedUsers = await this.bansRepository.getBannedUsers();
        const query = `
          SELECT *
          FROM "PostsLikes"
          WHERE "postId" = $1 AND "userId" ${bannedUsers.length ? `NOT IN (${bannedUsers})` : `IS NOT NULL`}
      `;
        const likes = await this.dataSource.query(query, [postId]);
        return likes;
    }
    async findThreeLatestLikes(postId) {
        const bannedUsers = await this.bansRepository.getBannedUsers();
        const allLikes = await this.dataSource.query(`
          SELECT *
          FROM "PostsLikes"
          WHERE "postId" = $1 AND "userId" ${bannedUsers.length ? `NOT IN (${bannedUsers})` : `IS NOT NULL`} AND "likeStatus" = 'Like'
          ORDER BY "createdAt" DESC
      `, [postId]);
        const threeLatestLikes = allLikes.slice(0, 3);
        const mappedThreeLatestLikes = threeLatestLikes.map((like) => {
            return {
                addedAt: like.createdAt,
                userId: like.userId.toString(),
                login: like.login,
            };
        });
        return mappedThreeLatestLikes;
    }
};
PostsLikesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [bans_repository_1.BansRepository,
        typeorm_2.DataSource])
], PostsLikesRepository);
exports.PostsLikesRepository = PostsLikesRepository;
//# sourceMappingURL=posts.likes.repository.js.map