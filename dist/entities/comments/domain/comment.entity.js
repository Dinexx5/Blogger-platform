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
exports.Comment = void 0;
const typeorm_1 = require("typeorm");
const commentatorInfo_entity_1 = require("./commentatorInfo.entity");
const postInfo_entity_1 = require("./postInfo.entity");
const commentLike_entity_1 = require("../../likes/domain/commentLike.entity");
let Comment = class Comment {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Comment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Comment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => commentatorInfo_entity_1.CommentatorInfo, (ci) => ci.comment),
    __metadata("design:type", commentatorInfo_entity_1.CommentatorInfo)
], Comment.prototype, "commentatorInfo", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => postInfo_entity_1.PostInfoForComment, (pi) => pi.comment),
    __metadata("design:type", postInfo_entity_1.PostInfoForComment)
], Comment.prototype, "postInfo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => commentLike_entity_1.CommentLike, (l) => l.comment),
    __metadata("design:type", Array)
], Comment.prototype, "likes", void 0);
Comment = __decorate([
    (0, typeorm_1.Entity)()
], Comment);
exports.Comment = Comment;
//# sourceMappingURL=comment.entity.js.map