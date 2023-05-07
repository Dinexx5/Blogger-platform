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
exports.PostViewModel = exports.updatePostModel = exports.createPostModel = exports.NewestLikes = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class NewestLikes {
}
exports.NewestLikes = NewestLikes;
class createPostModel {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(0, 30),
    (0, class_transformer_1.Transform)(({ value }) => { var _a; return (_a = value === null || value === void 0 ? void 0 : value.trim) === null || _a === void 0 ? void 0 : _a.call(value); }),
    __metadata("design:type", String)
], createPostModel.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(0, 100),
    (0, class_transformer_1.Transform)(({ value }) => { var _a; return (_a = value === null || value === void 0 ? void 0 : value.trim) === null || _a === void 0 ? void 0 : _a.call(value); }),
    __metadata("design:type", String)
], createPostModel.prototype, "shortDescription", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(0, 1000),
    (0, class_transformer_1.Transform)(({ value }) => { var _a; return (_a = value === null || value === void 0 ? void 0 : value.trim) === null || _a === void 0 ? void 0 : _a.call(value); }),
    __metadata("design:type", String)
], createPostModel.prototype, "content", void 0);
exports.createPostModel = createPostModel;
class updatePostModel {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(0, 30),
    (0, class_transformer_1.Transform)(({ value }) => { var _a; return (_a = value === null || value === void 0 ? void 0 : value.trim) === null || _a === void 0 ? void 0 : _a.call(value); }),
    __metadata("design:type", String)
], updatePostModel.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(0, 100),
    (0, class_transformer_1.Transform)(({ value }) => { var _a; return (_a = value === null || value === void 0 ? void 0 : value.trim) === null || _a === void 0 ? void 0 : _a.call(value); }),
    __metadata("design:type", String)
], updatePostModel.prototype, "shortDescription", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(0, 1000),
    (0, class_transformer_1.Transform)(({ value }) => { var _a; return (_a = value === null || value === void 0 ? void 0 : value.trim) === null || _a === void 0 ? void 0 : _a.call(value); }),
    __metadata("design:type", String)
], updatePostModel.prototype, "content", void 0);
exports.updatePostModel = updatePostModel;
class PostViewModel {
    constructor(id, title, shortDescription, content, blogId, blogName, createdAt, extendedLikesInfo) {
        this.id = id;
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
        this.blogName = blogName;
        this.createdAt = createdAt;
        this.extendedLikesInfo = extendedLikesInfo;
    }
}
exports.PostViewModel = PostViewModel;
//# sourceMappingURL=posts.models.js.map