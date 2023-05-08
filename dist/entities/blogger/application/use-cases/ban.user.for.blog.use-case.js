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
exports.BanUserForBlogUseCase = exports.BanUserForBlogCommand = void 0;
const users_repository_1 = require("../../../users/users.repository");
const blogs_repository_1 = require("../../../blogs/blogs.repository");
const posts_repository_1 = require("../../../posts/posts.repository");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const blogOwner_entity_1 = require("../../../blogs/domain/blogOwner.entity");
const typeorm_2 = require("typeorm");
const userBanForBlog_entity_1 = require("../../domain/userBanForBlog.entity");
class BanUserForBlogCommand {
    constructor(userId, inputModel, ownerId) {
        this.userId = userId;
        this.inputModel = inputModel;
        this.ownerId = ownerId;
    }
}
exports.BanUserForBlogCommand = BanUserForBlogCommand;
let BanUserForBlogUseCase = class BanUserForBlogUseCase {
    constructor(usersRepository, postsRepository, blogsRepository, blogOwnerInfoRepository, usersBansForBlogsRepository) {
        this.usersRepository = usersRepository;
        this.postsRepository = postsRepository;
        this.blogsRepository = blogsRepository;
        this.blogOwnerInfoRepository = blogOwnerInfoRepository;
        this.usersBansForBlogsRepository = usersBansForBlogsRepository;
    }
    async execute(command) {
        const ownerId = command.ownerId;
        const userId = command.userId;
        const inputModel = command.inputModel;
        const blogId = +inputModel.blogId;
        const blog = await this.blogsRepository.findBlogById(blogId);
        if (!blog)
            throw new common_1.NotFoundException();
        const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
        if (blogOwnerInfo.userId !== ownerId)
            throw new common_1.ForbiddenException();
        const userToBan = await this.usersRepository.findUserById(userId);
        if (!userToBan)
            throw new common_1.NotFoundException();
        const login = userToBan.login;
        if (inputModel.isBanned === true) {
            const isBannedBefore = await this.usersBansForBlogsRepository.findOneBy({
                blogId: blogId,
                userId: userId,
            });
            if (isBannedBefore)
                return;
            const bannedPostsIds = await this.postsRepository.findPostsForUser([blogId]);
            const ban = await this.usersBansForBlogsRepository.create();
            ban.userId = userId;
            ban.login = login;
            ban.blogId = blogId;
            ban.isBanned = true;
            ban.banReason = inputModel.banReason;
            ban.banDate = new Date().toISOString();
            ban.bannedPostsIds = bannedPostsIds;
            await this.usersBansForBlogsRepository.save(ban);
            return;
        }
        const ban = await this.usersBansForBlogsRepository.findOneBy({
            blogId: blogId,
            userId: userId,
        });
        if (!ban)
            return;
        await this.usersBansForBlogsRepository.delete({ userId: userId, blogId: blogId });
    }
};
BanUserForBlogUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(BanUserForBlogCommand),
    __param(3, (0, typeorm_1.InjectRepository)(blogOwner_entity_1.BlogOwnerInfo)),
    __param(4, (0, typeorm_1.InjectRepository)(userBanForBlog_entity_1.UserBanForBlog)),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        posts_repository_1.PostsRepository,
        blogs_repository_1.BlogsRepository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BanUserForBlogUseCase);
exports.BanUserForBlogUseCase = BanUserForBlogUseCase;
//# sourceMappingURL=ban.user.for.blog.use-case.js.map