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
exports.BansUserUseCase = exports.BansUserCommand = void 0;
const users_repository_1 = require("../../../users/users.repository");
const bans_repository_1 = require("../../bans.repository");
const blogs_repository_1 = require("../../../blogs/blogs.repository");
const posts_repository_1 = require("../../../posts/posts.repository");
const comments_repository_1 = require("../../../comments/comments.repository");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const banInfo_entity_1 = require("../../../users/domain/banInfo.entity");
const token_entity_1 = require("../../../tokens/domain/token.entity");
const device_entity_1 = require("../../../devices/domain/device.entity");
const saUserBan_entity_1 = require("../../domain/saUserBan.entity");
class BansUserCommand {
    constructor(userId, inputModel) {
        this.userId = userId;
        this.inputModel = inputModel;
    }
}
exports.BansUserCommand = BansUserCommand;
let BansUserUseCase = class BansUserUseCase {
    constructor(userBanInfoRepository, tokenRepository, usersRepository, blogsRepository, postsRepository, commentsRepository, bansRepository, bansTypeOrmRepository, devicesRepository) {
        this.userBanInfoRepository = userBanInfoRepository;
        this.tokenRepository = tokenRepository;
        this.usersRepository = usersRepository;
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
        this.commentsRepository = commentsRepository;
        this.bansRepository = bansRepository;
        this.bansTypeOrmRepository = bansTypeOrmRepository;
        this.devicesRepository = devicesRepository;
    }
    async execute(command) {
        const userId = command.userId;
        const inputModel = command.inputModel;
        const user = await this.usersRepository.findUserById(userId);
        const login = user.login;
        if (inputModel.isBanned === true) {
            const isBannedBefore = await this.bansRepository.isUserBanned(userId);
            if (isBannedBefore)
                return;
            const banDate = new Date().toISOString();
            const userBanInfo = await this.userBanInfoRepository.findOneBy({ userId: userId });
            userBanInfo.isBanned = true;
            userBanInfo.banDate = banDate;
            userBanInfo.banReason = inputModel.banReason;
            await this.userBanInfoRepository.save(userBanInfo);
            await this.devicesRepository.delete({ userId: userId });
            await this.tokenRepository.delete({ userId: userId });
            const ban = await this.bansTypeOrmRepository.create();
            ban.userId = userId;
            ban.login = login;
            ban.isBanned = true;
            ban.banReason = inputModel.banReason;
            ban.bannedBlogsIds = [];
            ban.bannedPostsIds = [];
            ban.bannedCommentsIds = [];
            await this.bansTypeOrmRepository.save(ban);
            return;
        }
        const bananaInstance = await this.bansRepository.isUserBanned(userId);
        if (!bananaInstance) {
            return;
        }
        const userBanInfo = await this.userBanInfoRepository.findOneBy({ userId: userId });
        userBanInfo.isBanned = false;
        userBanInfo.banDate = null;
        userBanInfo.banReason = null;
        await this.userBanInfoRepository.save(userBanInfo);
        await this.bansTypeOrmRepository.delete({ userId: userId });
    }
};
BansUserUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(BansUserCommand),
    __param(0, (0, typeorm_1.InjectRepository)(banInfo_entity_1.UserBanInfo)),
    __param(1, (0, typeorm_1.InjectRepository)(token_entity_1.Token)),
    __param(7, (0, typeorm_1.InjectRepository)(saUserBan_entity_1.SaUserBan)),
    __param(8, (0, typeorm_1.InjectRepository)(device_entity_1.Device)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        users_repository_1.UsersRepository,
        blogs_repository_1.BlogsRepository,
        posts_repository_1.PostsRepository,
        comments_repository_1.CommentsRepository,
        bans_repository_1.BansRepository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BansUserUseCase);
exports.BansUserUseCase = BansUserUseCase;
//# sourceMappingURL=ban.user.use.case..js.map