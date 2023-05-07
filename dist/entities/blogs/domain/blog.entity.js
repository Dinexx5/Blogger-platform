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
exports.Blog = void 0;
const typeorm_1 = require("typeorm");
const blogOwner_entity_1 = require("./blogOwner.entity");
const blogBansInfo_entity_1 = require("./blogBansInfo.entity");
let Blog = class Blog {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Blog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Blog.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Blog.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Blog.prototype, "isMembership", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Blog.prototype, "websiteUrl", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Blog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => blogOwner_entity_1.BlogOwnerInfo, (ow) => ow.blog),
    __metadata("design:type", blogOwner_entity_1.BlogOwnerInfo)
], Blog.prototype, "blogOwnerInfo", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => blogBansInfo_entity_1.BlogBansInfo, (bi) => bi.blog),
    __metadata("design:type", blogBansInfo_entity_1.BlogBansInfo)
], Blog.prototype, "banInfo", void 0);
Blog = __decorate([
    (0, typeorm_1.Entity)()
], Blog);
exports.Blog = Blog;
//# sourceMappingURL=blog.entity.js.map