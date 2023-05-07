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
exports.CommentLike = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/domain/user.entity");
const comment_entity_1 = require("../../comments/domain/comment.entity");
let CommentLike = class CommentLike {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CommentLike.prototype, "likeStatus", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], CommentLike.prototype, "commentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CommentLike.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CommentLike.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => comment_entity_1.Comment),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", comment_entity_1.Comment)
], CommentLike.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], CommentLike.prototype, "user", void 0);
CommentLike = __decorate([
    (0, typeorm_1.Entity)()
], CommentLike);
exports.CommentLike = CommentLike;
//# sourceMappingURL=commentLike.entity.js.map