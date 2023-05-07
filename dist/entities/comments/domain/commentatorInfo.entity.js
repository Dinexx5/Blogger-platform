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
exports.CommentatorInfo = void 0;
const typeorm_1 = require("typeorm");
const comment_entity_1 = require("./comment.entity");
const user_entity_1 = require("../../users/domain/user.entity");
let CommentatorInfo = class CommentatorInfo {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], CommentatorInfo.prototype, "commentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CommentatorInfo.prototype, "userLogin", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], CommentatorInfo.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => comment_entity_1.Comment),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", comment_entity_1.Comment)
], CommentatorInfo.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CommentatorInfo.prototype, "userId", void 0);
CommentatorInfo = __decorate([
    (0, typeorm_1.Entity)()
], CommentatorInfo);
exports.CommentatorInfo = CommentatorInfo;
//# sourceMappingURL=commentatorInfo.entity.js.map