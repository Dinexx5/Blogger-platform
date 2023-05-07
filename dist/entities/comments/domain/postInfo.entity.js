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
exports.PostInfoForComment = void 0;
const typeorm_1 = require("typeorm");
const comment_entity_1 = require("./comment.entity");
const post_entity_1 = require("../../posts/domain/post.entity");
const blog_entity_1 = require("../../blogs/domain/blog.entity");
let PostInfoForComment = class PostInfoForComment {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], PostInfoForComment.prototype, "commentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PostInfoForComment.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PostInfoForComment.prototype, "blogName", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => post_entity_1.Post),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", post_entity_1.Post)
], PostInfoForComment.prototype, "post", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => blog_entity_1.Blog),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", blog_entity_1.Blog)
], PostInfoForComment.prototype, "blog", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => comment_entity_1.Comment),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", comment_entity_1.Comment)
], PostInfoForComment.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PostInfoForComment.prototype, "postId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PostInfoForComment.prototype, "blogId", void 0);
PostInfoForComment = __decorate([
    (0, typeorm_1.Entity)()
], PostInfoForComment);
exports.PostInfoForComment = PostInfoForComment;
//# sourceMappingURL=postInfo.entity.js.map