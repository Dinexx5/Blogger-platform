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
exports.CommentsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("./domain/comment.entity");
const commentatorInfo_entity_1 = require("./domain/commentatorInfo.entity");
let CommentsRepository = class CommentsRepository {
    constructor(commentsTypeOrmRepository, commentatorInfoTypeOrmRepository) {
        this.commentsTypeOrmRepository = commentsTypeOrmRepository;
        this.commentatorInfoTypeOrmRepository = commentatorInfoTypeOrmRepository;
    }
    async findComment(commentId) {
        return await this.commentsTypeOrmRepository.findOneBy({ id: commentId });
    }
    async findBannedComments(userId) {
        const commentatorsInfo = await this.commentatorInfoTypeOrmRepository.findBy({ userId: userId });
        return commentatorsInfo.map((comments) => comments.commentId);
    }
};
CommentsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(1, (0, typeorm_1.InjectRepository)(commentatorInfo_entity_1.CommentatorInfo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CommentsRepository);
exports.CommentsRepository = CommentsRepository;
//# sourceMappingURL=comments.repository.js.map