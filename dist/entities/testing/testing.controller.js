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
exports.TestingController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/domain/user.entity");
const attempt_entity_1 = require("../attempts/domain/attempt.entity");
const blogBansInfo_entity_1 = require("../blogs/domain/blogBansInfo.entity");
const blogOwner_entity_1 = require("../blogs/domain/blogOwner.entity");
const commentatorInfo_entity_1 = require("../comments/domain/commentatorInfo.entity");
const postInfo_entity_1 = require("../comments/domain/postInfo.entity");
const device_entity_1 = require("../devices/domain/device.entity");
const postLike_entity_1 = require("../likes/domain/postLike.entity");
const commentLike_entity_1 = require("../likes/domain/commentLike.entity");
const token_entity_1 = require("../tokens/domain/token.entity");
const saBlogBan_entity_1 = require("../bans/domain/saBlogBan.entity");
const saUserBan_entity_1 = require("../bans/domain/saUserBan.entity");
const banInfo_entity_1 = require("../users/domain/banInfo.entity");
const emailConfirmation_entity_1 = require("../users/domain/emailConfirmation.entity");
const passwordRecovery_entity_1 = require("../users/domain/passwordRecovery.entity");
const userBanForBlog_entity_1 = require("../blogger/domain/userBanForBlog.entity");
const comment_entity_1 = require("../comments/domain/comment.entity");
const post_entity_1 = require("../posts/domain/post.entity");
const blog_entity_1 = require("../blogs/domain/blog.entity");
const question_entity_1 = require("../quiz/domain/question.entity");
let TestingController = class TestingController {
    constructor(attempts, blogBansInfo, blogOwners, commentatorInfo, postInfo, devices, postsLikes, commentsLikes, tokens, blogBans, userBans, userBansInfo, emailConfirmationInfo, passwordRecoveryInfo, userBansForBlog, comments, posts, blogs, users, questions) {
        this.attempts = attempts;
        this.blogBansInfo = blogBansInfo;
        this.blogOwners = blogOwners;
        this.commentatorInfo = commentatorInfo;
        this.postInfo = postInfo;
        this.devices = devices;
        this.postsLikes = postsLikes;
        this.commentsLikes = commentsLikes;
        this.tokens = tokens;
        this.blogBans = blogBans;
        this.userBans = userBans;
        this.userBansInfo = userBansInfo;
        this.emailConfirmationInfo = emailConfirmationInfo;
        this.passwordRecoveryInfo = passwordRecoveryInfo;
        this.userBansForBlog = userBansForBlog;
        this.comments = comments;
        this.posts = posts;
        this.blogs = blogs;
        this.users = users;
        this.questions = questions;
    }
    async deleteAll(res) {
        await this.questions.delete({});
        await this.attempts.delete({});
        await this.blogBansInfo.delete({});
        await this.blogOwners.delete({});
        await this.commentatorInfo.delete({});
        await this.postInfo.delete({});
        await this.devices.delete({});
        await this.postsLikes.delete({});
        await this.commentsLikes.delete({});
        await this.tokens.delete({});
        await this.blogBans.delete({});
        await this.userBans.delete({});
        await this.userBansInfo.delete({});
        await this.emailConfirmationInfo.delete({});
        await this.passwordRecoveryInfo.delete({});
        await this.userBansForBlog.delete({});
        await this.comments.delete({});
        await this.posts.delete({});
        await this.blogs.delete({});
        await this.users.delete({});
        return res.sendStatus(204);
    }
};
__decorate([
    (0, common_1.Delete)('all-data'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestingController.prototype, "deleteAll", null);
TestingController = __decorate([
    (0, common_1.Controller)('testing'),
    __param(0, (0, typeorm_1.InjectRepository)(attempt_entity_1.Attempt)),
    __param(1, (0, typeorm_1.InjectRepository)(blogBansInfo_entity_1.BlogBansInfo)),
    __param(2, (0, typeorm_1.InjectRepository)(blogOwner_entity_1.BlogOwnerInfo)),
    __param(3, (0, typeorm_1.InjectRepository)(commentatorInfo_entity_1.CommentatorInfo)),
    __param(4, (0, typeorm_1.InjectRepository)(postInfo_entity_1.PostInfoForComment)),
    __param(5, (0, typeorm_1.InjectRepository)(device_entity_1.Device)),
    __param(6, (0, typeorm_1.InjectRepository)(postLike_entity_1.PostLike)),
    __param(7, (0, typeorm_1.InjectRepository)(commentLike_entity_1.CommentLike)),
    __param(8, (0, typeorm_1.InjectRepository)(token_entity_1.Token)),
    __param(9, (0, typeorm_1.InjectRepository)(saBlogBan_entity_1.SaBlogBan)),
    __param(10, (0, typeorm_1.InjectRepository)(saUserBan_entity_1.SaUserBan)),
    __param(11, (0, typeorm_1.InjectRepository)(banInfo_entity_1.UserBanInfo)),
    __param(12, (0, typeorm_1.InjectRepository)(emailConfirmation_entity_1.EmailConfirmationInfo)),
    __param(13, (0, typeorm_1.InjectRepository)(passwordRecovery_entity_1.PasswordRecoveryInfo)),
    __param(14, (0, typeorm_1.InjectRepository)(userBanForBlog_entity_1.UserBanForBlog)),
    __param(15, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(16, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(17, (0, typeorm_1.InjectRepository)(blog_entity_1.Blog)),
    __param(18, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(19, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TestingController);
exports.TestingController = TestingController;
//# sourceMappingURL=testing.controller.js.map