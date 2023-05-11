"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestingModule = void 0;
const common_1 = require("@nestjs/common");
const testing_controller_1 = require("./testing.controller");
const typeorm_1 = require("@nestjs/typeorm");
const blog_entity_1 = require("../blogs/domain/blog.entity");
const blogOwner_entity_1 = require("../blogs/domain/blogOwner.entity");
const blogBansInfo_entity_1 = require("../blogs/domain/blogBansInfo.entity");
const saBlogBan_entity_1 = require("../bans/domain/saBlogBan.entity");
const saUserBan_entity_1 = require("../bans/domain/saUserBan.entity");
const userBanForBlog_entity_1 = require("../blogger/domain/userBanForBlog.entity");
const banInfo_entity_1 = require("../users/domain/banInfo.entity");
const token_entity_1 = require("../tokens/domain/token.entity");
const device_entity_1 = require("../devices/domain/device.entity");
const attempt_entity_1 = require("../attempts/domain/attempt.entity");
const comment_entity_1 = require("../comments/domain/comment.entity");
const commentatorInfo_entity_1 = require("../comments/domain/commentatorInfo.entity");
const postInfo_entity_1 = require("../comments/domain/postInfo.entity");
const postLike_entity_1 = require("../likes/domain/postLike.entity");
const commentLike_entity_1 = require("../likes/domain/commentLike.entity");
const post_entity_1 = require("../posts/domain/post.entity");
const user_entity_1 = require("../users/domain/user.entity");
const emailConfirmation_entity_1 = require("../users/domain/emailConfirmation.entity");
const passwordRecovery_entity_1 = require("../users/domain/passwordRecovery.entity");
const question_entity_1 = require("../quiz/domain/question.entity");
let TestingModule = class TestingModule {
};
TestingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                attempt_entity_1.Attempt,
                blog_entity_1.Blog,
                blogOwner_entity_1.BlogOwnerInfo,
                blogBansInfo_entity_1.BlogBansInfo,
                comment_entity_1.Comment,
                commentatorInfo_entity_1.CommentatorInfo,
                emailConfirmation_entity_1.EmailConfirmationInfo,
                passwordRecovery_entity_1.PasswordRecoveryInfo,
                postInfo_entity_1.PostInfoForComment,
                postLike_entity_1.PostLike,
                post_entity_1.Post,
                user_entity_1.User,
                commentLike_entity_1.CommentLike,
                saBlogBan_entity_1.SaBlogBan,
                saUserBan_entity_1.SaUserBan,
                userBanForBlog_entity_1.UserBanForBlog,
                banInfo_entity_1.UserBanInfo,
                token_entity_1.Token,
                device_entity_1.Device,
                question_entity_1.Question,
            ]),
        ],
        providers: [],
        controllers: [testing_controller_1.TestingController],
        exports: [],
    })
], TestingModule);
exports.TestingModule = TestingModule;
//# sourceMappingURL=testing.module.js.map