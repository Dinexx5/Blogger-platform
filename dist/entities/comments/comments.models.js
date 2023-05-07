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
exports.commentsForBloggerViewModel = exports.CommentViewModel = exports.LikeInputModel = exports.UpdateCommentModel = exports.CreateCommentModel = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const like_status_decorator_1 = require("../../shared/decorators/validation/like-status.decorator");
class CreateCommentModel {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(20, 300),
    (0, class_transformer_1.Transform)(({ value }) => { var _a; return (_a = value === null || value === void 0 ? void 0 : value.trim) === null || _a === void 0 ? void 0 : _a.call(value); }),
    __metadata("design:type", String)
], CreateCommentModel.prototype, "content", void 0);
exports.CreateCommentModel = CreateCommentModel;
class UpdateCommentModel {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(20, 300),
    (0, class_transformer_1.Transform)(({ value }) => { var _a; return (_a = value === null || value === void 0 ? void 0 : value.trim) === null || _a === void 0 ? void 0 : _a.call(value); }),
    __metadata("design:type", String)
], UpdateCommentModel.prototype, "content", void 0);
exports.UpdateCommentModel = UpdateCommentModel;
class LikeInputModel {
}
__decorate([
    (0, like_status_decorator_1.IsLikeStatusCorrect)(),
    __metadata("design:type", String)
], LikeInputModel.prototype, "likeStatus", void 0);
exports.LikeInputModel = LikeInputModel;
class CommentViewModel {
    constructor(id, content, commentatorInfo, createdAt, likesInfo) {
        this.id = id;
        this.content = content;
        this.commentatorInfo = commentatorInfo;
        this.createdAt = createdAt;
        this.likesInfo = likesInfo;
    }
}
exports.CommentViewModel = CommentViewModel;
class commentsForBloggerViewModel {
    constructor(id, content, commentatorInfo, createdAt, likesInfo, postInfo) {
        this.id = id;
        this.content = content;
        this.commentatorInfo = commentatorInfo;
        this.createdAt = createdAt;
        this.likesInfo = likesInfo;
        this.postInfo = postInfo;
    }
}
exports.commentsForBloggerViewModel = commentsForBloggerViewModel;
//# sourceMappingURL=comments.models.js.map