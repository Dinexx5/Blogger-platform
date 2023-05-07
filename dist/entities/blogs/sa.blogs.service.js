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
exports.SuperAdminBlogsService = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("../users/users.repository");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const blogOwner_entity_1 = require("./domain/blogOwner.entity");
let SuperAdminBlogsService = class SuperAdminBlogsService {
    constructor(blogOwnerInfoRepository, usersRepository) {
        this.blogOwnerInfoRepository = blogOwnerInfoRepository;
        this.usersRepository = usersRepository;
    }
    async bindBlog(blogId, userId) {
        const user = await this.usersRepository.findUserById(userId);
        const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
        blogOwnerInfo.userId = userId;
        blogOwnerInfo.userLogin = user.login;
        await this.blogOwnerInfoRepository.save(blogOwnerInfo);
    }
};
SuperAdminBlogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(blogOwner_entity_1.BlogOwnerInfo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_repository_1.UsersRepository])
], SuperAdminBlogsService);
exports.SuperAdminBlogsService = SuperAdminBlogsService;
//# sourceMappingURL=sa.blogs.service.js.map