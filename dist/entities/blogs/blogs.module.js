"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsModule = void 0;
const common_1 = require("@nestjs/common");
const blogger_controller_1 = require("../blogger/blogger.controller");
const blogs_service_1 = require("./blogs.service");
const blogs_repository_1 = require("./blogs.repository");
const blogs_query_repo_1 = require("./blogs.query-repo");
const blog_bound_decorator_1 = require("../../shared/decorators/validation/blog-bound.decorator");
const auth_module_1 = require("../auth/auth.module");
const posts_module_1 = require("../posts/posts.module");
const blogs_controller_1 = require("./blogs.controller");
const users_module_1 = require("../users/users.module");
const sa_blogs_controller_1 = require("./sa.blogs.controller");
const sa_blogs_service_1 = require("./sa.blogs.service");
const user_exists_decorator_1 = require("../../shared/decorators/validation/user-exists.decorator");
const sa_blog_query_repo_1 = require("./sa.blog.query-repo");
const ban_user_use_case_1 = require("../bans/application/use-cases/ban.user.use.case.");
const comments_module_1 = require("../comments/comments.module");
const bans_repository_1 = require("../bans/bans.repository");
const devices_module_1 = require("../devices/devices.module");
const token_module_1 = require("../tokens/token.module");
const cqrs_1 = require("@nestjs/cqrs");
const ban_blog_use_case_1 = require("./application/use-cases/ban.blog.use-case");
const bans_blogs_repository_1 = require("../bans/bans.blogs.repository");
const blogger_users_controller_1 = require("../blogger/blogger.users.controller");
const bans_users_for_blog_repository_1 = require("../bans/bans.users-for-blog.repository");
const ban_user_for_blog_use_case_1 = require("../blogger/application/use-cases/ban.user.for.blog.use-case");
const blogger_bans_query_repository_1 = require("../blogger/blogger.bans.query-repository");
const blogger_comments_query_repo_1 = require("../blogger/blogger.comments.query-repo");
const typeorm_1 = require("@nestjs/typeorm");
const blog_entity_1 = require("./domain/blog.entity");
const blogOwner_entity_1 = require("./domain/blogOwner.entity");
const blogBansInfo_entity_1 = require("./domain/blogBansInfo.entity");
const saBlogBan_entity_1 = require("../bans/domain/saBlogBan.entity");
const userBanForBlog_entity_1 = require("../blogger/domain/userBanForBlog.entity");
const banInfo_entity_1 = require("../users/domain/banInfo.entity");
const token_entity_1 = require("../tokens/domain/token.entity");
const device_entity_1 = require("../devices/domain/device.entity");
const saUserBan_entity_1 = require("../bans/domain/saUserBan.entity");
const comment_entity_1 = require("../comments/domain/comment.entity");
let BlogsModule = class BlogsModule {
};
BlogsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                blog_entity_1.Blog,
                blogOwner_entity_1.BlogOwnerInfo,
                blogBansInfo_entity_1.BlogBansInfo,
                saBlogBan_entity_1.SaBlogBan,
                saUserBan_entity_1.SaUserBan,
                userBanForBlog_entity_1.UserBanForBlog,
                banInfo_entity_1.UserBanInfo,
                token_entity_1.Token,
                device_entity_1.Device,
                saBlogBan_entity_1.SaBlogBan,
                comment_entity_1.Comment,
            ]),
            cqrs_1.CqrsModule,
            auth_module_1.AuthModule,
            posts_module_1.PostsModule,
            users_module_1.UsersModule,
            comments_module_1.CommentsModule,
            devices_module_1.DevicesModule,
            token_module_1.TokensModule,
        ],
        providers: [
            blogs_service_1.BlogsService,
            blogs_repository_1.BlogsRepository,
            blogs_query_repo_1.BlogsQueryRepository,
            blog_bound_decorator_1.IsBlogAttachedDecorator,
            user_exists_decorator_1.IsUserExistsDecorator,
            sa_blogs_service_1.SuperAdminBlogsService,
            sa_blog_query_repo_1.BlogsSAQueryRepository,
            ban_user_use_case_1.BansUserUseCase,
            ban_blog_use_case_1.BansBlogUseCase,
            bans_repository_1.BansRepository,
            bans_blogs_repository_1.BlogBansRepository,
            bans_users_for_blog_repository_1.UsersBansForBlogRepository,
            ban_user_for_blog_use_case_1.BanUserForBlogUseCase,
            blogger_bans_query_repository_1.BloggerBansQueryRepository,
            blogger_comments_query_repo_1.BloggerCommentsQueryRepository,
        ],
        controllers: [
            blogger_controller_1.BloggerController,
            blogger_users_controller_1.BloggerUsersController,
            blogs_controller_1.BlogsController,
            sa_blogs_controller_1.SuperAdminBlogsController,
        ],
        exports: [
            blogs_service_1.BlogsService,
            blogs_repository_1.BlogsRepository,
            blogs_query_repo_1.BlogsQueryRepository,
            sa_blogs_service_1.SuperAdminBlogsService,
            blogger_comments_query_repo_1.BloggerCommentsQueryRepository,
        ],
    })
], BlogsModule);
exports.BlogsModule = BlogsModule;
//# sourceMappingURL=blogs.module.js.map