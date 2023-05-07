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
exports.BlogBansInfo = void 0;
const typeorm_1 = require("typeorm");
const blog_entity_1 = require("./blog.entity");
let BlogBansInfo = class BlogBansInfo {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], BlogBansInfo.prototype, "isBanned", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BlogBansInfo.prototype, "banDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => blog_entity_1.Blog),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", blog_entity_1.Blog)
], BlogBansInfo.prototype, "blog", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], BlogBansInfo.prototype, "blogId", void 0);
BlogBansInfo = __decorate([
    (0, typeorm_1.Entity)()
], BlogBansInfo);
exports.BlogBansInfo = BlogBansInfo;
//# sourceMappingURL=blogBansInfo.entity.js.map