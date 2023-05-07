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
exports.updateBlogModel = exports.createBlogModel = exports.BlogSAViewModel = exports.BlogViewModel = exports.blogAndUserParamModel = exports.blogAndPostParamModel = exports.BanBlogModel = exports.blogParamModel = void 0;
const class_validator_1 = require("class-validator");
const blog_bound_decorator_1 = require("../../shared/decorators/validation/blog-bound.decorator");
const user_exists_decorator_1 = require("../../shared/decorators/validation/user-exists.decorator");
const class_transformer_1 = require("class-transformer");
class blogParamModel {
}
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => +value),
    __metadata("design:type", Number)
], blogParamModel.prototype, "blogId", void 0);
exports.blogParamModel = blogParamModel;
class BanBlogModel {
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], BanBlogModel.prototype, "isBanned", void 0);
exports.BanBlogModel = BanBlogModel;
class blogAndPostParamModel {
}
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => +value),
    __metadata("design:type", Number)
], blogAndPostParamModel.prototype, "blogId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => +value),
    __metadata("design:type", Number)
], blogAndPostParamModel.prototype, "postId", void 0);
exports.blogAndPostParamModel = blogAndPostParamModel;
class blogAndUserParamModel {
}
__decorate([
    (0, blog_bound_decorator_1.IsBlogAttached)(),
    (0, class_transformer_1.Transform)(({ value }) => +value),
    __metadata("design:type", Number)
], blogAndUserParamModel.prototype, "blogId", void 0);
__decorate([
    (0, user_exists_decorator_1.IsUserExists)(),
    (0, class_transformer_1.Transform)(({ value }) => +value),
    __metadata("design:type", Number)
], blogAndUserParamModel.prototype, "userId", void 0);
exports.blogAndUserParamModel = blogAndUserParamModel;
class BlogViewModel {
    constructor(id, name, description, isMembership, websiteUrl, createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isMembership = isMembership;
        this.websiteUrl = websiteUrl;
        this.createdAt = createdAt;
    }
}
exports.BlogViewModel = BlogViewModel;
class BlogSAViewModel {
    constructor(id, name, description, isMembership, websiteUrl, createdAt, blogOwnerInfo, banInfo) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isMembership = isMembership;
        this.websiteUrl = websiteUrl;
        this.createdAt = createdAt;
        this.blogOwnerInfo = blogOwnerInfo;
        this.banInfo = banInfo;
    }
}
exports.BlogSAViewModel = BlogSAViewModel;
class createBlogModel {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(0, 15),
    (0, class_transformer_1.Transform)(({ value }) => { var _a; return (_a = value === null || value === void 0 ? void 0 : value.trim) === null || _a === void 0 ? void 0 : _a.call(value); }),
    __metadata("design:type", String)
], createBlogModel.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(0, 500),
    (0, class_transformer_1.Transform)(({ value }) => { var _a; return (_a = value === null || value === void 0 ? void 0 : value.trim) === null || _a === void 0 ? void 0 : _a.call(value); }),
    __metadata("design:type", String)
], createBlogModel.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], createBlogModel.prototype, "websiteUrl", void 0);
exports.createBlogModel = createBlogModel;
class updateBlogModel {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(0, 15),
    (0, class_transformer_1.Transform)(({ value }) => { var _a; return (_a = value === null || value === void 0 ? void 0 : value.trim) === null || _a === void 0 ? void 0 : _a.call(value); }),
    __metadata("design:type", String)
], updateBlogModel.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(0, 500),
    (0, class_transformer_1.Transform)(({ value }) => { var _a; return (_a = value === null || value === void 0 ? void 0 : value.trim) === null || _a === void 0 ? void 0 : _a.call(value); }),
    __metadata("design:type", String)
], updateBlogModel.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], updateBlogModel.prototype, "websiteUrl", void 0);
exports.updateBlogModel = updateBlogModel;
//# sourceMappingURL=blogs.models.js.map