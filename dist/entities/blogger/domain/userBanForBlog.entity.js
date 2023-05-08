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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBanForBlog = void 0;
const typeorm_1 = require("typeorm");
const blog_entity_1 = require("../../blogs/domain/blog.entity");
const user_entity_1 = require("../../users/domain/user.entity");
let UserBanForBlog = class UserBanForBlog {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserBanForBlog.prototype, "login", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], UserBanForBlog.prototype, "isBanned", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserBanForBlog.prototype, "banReason", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserBanForBlog.prototype, "banDate", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { array: true }),
    __metadata("design:type", Array)
], UserBanForBlog.prototype, "bannedPostsIds", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserBanForBlog.prototype, "blogId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], UserBanForBlog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => blog_entity_1.Blog),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", blog_entity_1.Blog)
], UserBanForBlog.prototype, "blog", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], UserBanForBlog.prototype, "user", void 0);
UserBanForBlog = __decorate([
    (0, typeorm_1.Entity)()
], UserBanForBlog);
exports.UserBanForBlog = UserBanForBlog;
//# sourceMappingURL=userBanForBlog.entity.js.map