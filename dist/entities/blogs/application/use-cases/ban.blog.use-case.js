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
exports.BansBlogUseCase = exports.BanBlogCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const posts_repository_1 = require("../../../posts/posts.repository");
const blogs_repository_1 = require("../../blogs.repository");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const saBlogBan_entity_1 = require("../../../bans/domain/saBlogBan.entity");
const blogBansInfo_entity_1 = require("../../domain/blogBansInfo.entity");
class BanBlogCommand {
    constructor(blogId, inputModel) {
        this.blogId = blogId;
        this.inputModel = inputModel;
    }
}
exports.BanBlogCommand = BanBlogCommand;
let BansBlogUseCase = class BansBlogUseCase {
    constructor(blogsRepository, postsRepository, blogBansInfoRepository, blogBansRepository) {
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
        this.blogBansInfoRepository = blogBansInfoRepository;
        this.blogBansRepository = blogBansRepository;
    }
    async execute(command) {
        const blogId = command.blogId;
        const inputModel = command.inputModel;
        const isBanned = inputModel.isBanned;
        const blog = await this.blogsRepository.findBlogById(blogId);
        if (!blog)
            throw new common_1.NotFoundException();
        if (isBanned === true) {
            const isBannedBefore = await this.blogBansRepository.findOneBy({ blogId: blogId });
            if (isBannedBefore)
                return;
            const banInfo = await this.blogBansInfoRepository.findOneBy({ blogId: blogId });
            banInfo.isBanned = true;
            banInfo.banDate = new Date().toISOString();
            await this.blogBansInfoRepository.save(banInfo);
            const bannedPostsIds = await this.postsRepository.findPostsForUser([blogId]);
            const newBan = await this.blogBansRepository.create();
            newBan.isBanned = true;
            newBan.bannedPostsIds = bannedPostsIds;
            newBan.blogId = blogId;
            await this.blogBansRepository.save(newBan);
            return;
        }
        const ban = await this.blogBansRepository.findOneBy({ blogId: blogId });
        if (!ban) {
            return;
        }
        const banInfo = await this.blogBansInfoRepository.findOneBy({ blogId: blogId });
        banInfo.isBanned = false;
        banInfo.banDate = null;
        await this.blogBansInfoRepository.save(banInfo);
        await this.blogBansRepository.remove(ban);
    }
};
BansBlogUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(BanBlogCommand),
    __param(2, (0, typeorm_1.InjectRepository)(blogBansInfo_entity_1.BlogBansInfo)),
    __param(3, (0, typeorm_1.InjectRepository)(saBlogBan_entity_1.SaBlogBan)),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository,
        posts_repository_1.PostsRepository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BansBlogUseCase);
exports.BansBlogUseCase = BansBlogUseCase;
//# sourceMappingURL=ban.blog.use-case.js.map