import { Module } from '@nestjs/common';
import { BloggerController } from '../blogger/blogger.controller';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './blogs.repository';
import { BlogsQueryRepository } from './blogs.query-repo';
import { IsBlogAttachedDecorator } from '../../shared/decorators/validation/blog-bound.decorator';
import { AuthModule } from '../auth/auth.module';
import { PostsModule } from '../posts/posts.module';
import { BlogsController } from './blogs.controller';
import { UsersModule } from '../users/users.module';
import { SuperAdminBlogsController } from './sa.blogs.controller';
import { SuperAdminBlogsService } from './sa.blogs.service';
import { IsUserExistsDecorator } from '../../shared/decorators/validation/user-exists.decorator';
import { BlogsSAQueryRepository } from './sa.blog.query-repo';
import { BansUserUseCase } from '../bans/application/use-cases/ban.user.use.case.';
import { CommentsModule } from '../comments/comments.module';
import { BansRepository } from '../bans/bans.repository';
import { DevicesModule } from '../devices/devices.module';
import { TokensModule } from '../tokens/token.module';
import { CqrsModule } from '@nestjs/cqrs';
import { BansBlogUseCase } from './application/use-cases/ban.blog.use-case';
import { BlogBansRepository } from '../bans/bans.blogs.repository';
import { BloggerUsersController } from '../blogger/blogger.users.controller';
import { UsersBansForBlogRepository } from '../bans/bans.users-for-blog.repository';
import { BanUserForBlogUseCase } from '../blogger/application/use-cases/ban.user.for.blog.use-case';
import { BloggerBansQueryRepository } from '../blogger/blogger.bans.query-repository';
import { BloggerCommentsQueryRepository } from '../blogger/blogger.comments.query-repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/blog.entity';
import { BlogOwnerInfo } from './domain/blogOwner.entity';
import { BlogBansInfo } from './domain/blogBansInfo.entity';
import { SaBlogBan } from '../bans/domain/saBlogBan.entity';
import { UserBanForBlog } from '../blogger/domain/userBanForBlog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, BlogOwnerInfo, BlogBansInfo, SaBlogBan, UserBanForBlog]),
    CqrsModule,
    AuthModule,
    PostsModule,
    UsersModule,
    CommentsModule,
    DevicesModule,
    TokensModule,
  ],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    IsBlogAttachedDecorator,
    IsUserExistsDecorator,
    SuperAdminBlogsService,
    BlogsSAQueryRepository,
    BansUserUseCase,
    BansBlogUseCase,
    BansRepository,
    BlogBansRepository,
    UsersBansForBlogRepository,
    BanUserForBlogUseCase,
    BloggerBansQueryRepository,
    BloggerCommentsQueryRepository,
  ],
  controllers: [
    BloggerController,
    BloggerUsersController,
    BlogsController,
    SuperAdminBlogsController,
  ],
  exports: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    SuperAdminBlogsService,
    BloggerCommentsQueryRepository,
  ],
})
export class BlogsModule {}
