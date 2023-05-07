"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const users_module_1 = require("../users/users.module");
const comments_controller_1 = require("./comments.controller");
const comments_query_repo_1 = require("./comments.query-repo");
const comments_repository_1 = require("./comments.repository");
const comments_service_1 = require("./comments.service");
const posts_service_1 = require("../posts/posts.service");
const posts_repository_1 = require("../posts/posts.repository");
const blogs_query_repo_1 = require("../blogs/blogs.query-repo");
const like_status_decorator_1 = require("../../shared/decorators/validation/like-status.decorator");
const blogs_repository_1 = require("../blogs/blogs.repository");
const ban_user_use_case_1 = require("../bans/application/use-cases/ban.user.use.case.");
const bans_repository_1 = require("../bans/bans.repository");
const devices_module_1 = require("../devices/devices.module");
const token_module_1 = require("../tokens/token.module");
const comments_likes_repository_1 = require("../likes/comments.likes.repository");
const posts_likes_repository_1 = require("../likes/posts.likes.repository");
const bans_blogs_repository_1 = require("../bans/bans.blogs.repository");
const cqrs_1 = require("@nestjs/cqrs");
const bans_users_for_blog_repository_1 = require("../bans/bans.users-for-blog.repository");
const typeorm_1 = require("@nestjs/typeorm");
const comment_entity_1 = require("./domain/comment.entity");
const commentLike_entity_1 = require("../likes/domain/commentLike.entity");
const commentatorInfo_entity_1 = require("./domain/commentatorInfo.entity");
const postInfo_entity_1 = require("./domain/postInfo.entity");
const postLike_entity_1 = require("../likes/domain/postLike.entity");
const blogOwner_entity_1 = require("../blogs/domain/blogOwner.entity");
const post_entity_1 = require("../posts/domain/post.entity");
const blog_entity_1 = require("../blogs/domain/blog.entity");
const banInfo_entity_1 = require("../users/domain/banInfo.entity");
const token_entity_1 = require("../tokens/domain/token.entity");
const saUserBan_entity_1 = require("../bans/domain/saUserBan.entity");
const device_entity_1 = require("../devices/domain/device.entity");
const userBanForBlog_entity_1 = require("../blogger/domain/userBanForBlog.entity");
const saBlogBan_entity_1 = require("../bans/domain/saBlogBan.entity");
let CommentsModule = class CommentsModule {
};
CommentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                blog_entity_1.Blog,
                comment_entity_1.Comment,
                commentatorInfo_entity_1.CommentatorInfo,
                postInfo_entity_1.PostInfoForComment,
                post_entity_1.Post,
                postLike_entity_1.PostLike,
                commentLike_entity_1.CommentLike,
                blogOwner_entity_1.BlogOwnerInfo,
                banInfo_entity_1.UserBanInfo,
                token_entity_1.Token,
                saUserBan_entity_1.SaUserBan,
                device_entity_1.Device,
                userBanForBlog_entity_1.UserBanForBlog,
                saBlogBan_entity_1.SaBlogBan,
            ]),
            cqrs_1.CqrsModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            devices_module_1.DevicesModule,
            token_module_1.TokensModule,
        ],
        providers: [
            comments_query_repo_1.CommentsQueryRepository,
            comments_repository_1.CommentsRepository,
            comments_service_1.CommentsService,
            posts_service_1.PostsService,
            posts_repository_1.PostsRepository,
            blogs_query_repo_1.BlogsQueryRepository,
            blogs_repository_1.BlogsRepository,
            like_status_decorator_1.IsLikeStatusCorrectDecorator,
            ban_user_use_case_1.BansUserUseCase,
            bans_repository_1.BansRepository,
            bans_blogs_repository_1.BlogBansRepository,
            comments_likes_repository_1.CommentsLikesRepository,
            posts_likes_repository_1.PostsLikesRepository,
            bans_users_for_blog_repository_1.UsersBansForBlogRepository,
        ],
        controllers: [comments_controller_1.CommentsController],
        exports: [
            comments_query_repo_1.CommentsQueryRepository,
            comments_repository_1.CommentsRepository,
            comments_service_1.CommentsService,
            posts_service_1.PostsService,
            posts_repository_1.PostsRepository,
            blogs_query_repo_1.BlogsQueryRepository,
            blogs_repository_1.BlogsRepository,
            like_status_decorator_1.IsLikeStatusCorrectDecorator,
            comments_likes_repository_1.CommentsLikesRepository,
            posts_likes_repository_1.PostsLikesRepository,
        ],
    })
], CommentsModule);
exports.CommentsModule = CommentsModule;
//# sourceMappingURL=comments.module.js.map