import { Module } from '@nestjs/common';
import { BloggerController } from '../../blogger/blogger.controller';
import { BlogsRepository } from './blogs.repository';
import { BlogsQueryRepository } from './blogs.query-repo';
import { IsBlogAttachedDecorator } from '../../../shared/decorators/validation/blog-bound.decorator';
import { AuthModule } from '../../auth/auth.module';
import { PostsModule } from '../posts/posts.module';
import { BlogsController } from './blogs.controller';
import { UsersModule } from '../../admin/users/users.module';
import { SuperAdminBlogsController } from '../../admin/blogs/sa.blogs.controller';
import { SuperAdminBlogsService } from '../../admin/blogs/sa.blogs.service';
import { IsUserExistsDecorator } from '../../../shared/decorators/validation/user-exists.decorator';
import { BlogsSAQueryRepository } from '../../admin/blogs/sa.blog.query-repo';
import { BansUserUseCase } from '../../bans/application/use-cases/ban.user.use.case.';
import { CommentsModule } from '../comments/comments.module';
import { BansRepository } from '../../bans/bans.repository';
import { DevicesModule } from '../devices/devices.module';
import { TokensModule } from '../../tokens/token.module';
import { CqrsModule } from '@nestjs/cqrs';
import { BansBlogUseCase } from './application/use-cases/ban.blog.use-case';
import { BlogBansRepository } from '../../bans/bans.blogs.repository';
import { BloggerUsersController } from '../../blogger/blogger.users.controller';
import { UsersBansForBlogRepository } from '../../bans/bans.users-for-blog.repository';
import { BanUserForBlogUseCase } from '../../blogger/application/use-cases/ban.user.for.blog.use-case';
import { BloggerBansQueryRepository } from '../../blogger/blogger.bans.query-repository';
import { BloggerCommentsQueryRepository } from '../../blogger/blogger.comments.query-repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from '../../blogger/domain/blog.entity';
import { BlogOwnerInfoEntity } from '../../blogger/domain/blog-owner-info.entity';
import { BlogBanInfoEntity } from '../../blogger/domain/blog-ban-info.entity';
import { SaBlogBan } from '../../bans/domain/saBlogBan.entity';
import { UserBanForBlogEntity } from '../../blogger/domain/user-ban-for-blog.entity';
import { UserBanInfo } from '../../admin/users/domain/ban-info.entity';
import { Token } from '../../tokens/domain/token.entity';
import { Device } from '../devices/domain/device.entity';
import { SaUserBan } from '../../bans/domain/saUserBan.entity';
import { Comment } from '../comments/domain/comment.entity';
import { CreateBlogUseCase } from '../../blogger/application/use-cases/create-blog-use.case';
import { UpdateBlogUseCase } from '../../blogger/application/use-cases/update-blog-use.case';
import { DeleteBlogUseCase } from '../../blogger/application/use-cases/delete-blog-use.case';
import { DeletePostUseCase } from '../../blogger/application/use-cases/delete-post-use.case';
import { CreatePostUseCase } from '../../blogger/application/use-cases/create-post-use.case';
import { UpdatePostUseCase } from '../../blogger/application/use-cases/update-post-use.case';
import { PostEntity } from '../posts/domain/post.entity';
import { BlogsService } from '../../blogger/application/blogs.service';
import { BloggerFilesController } from '../../blogger/blogger.upload-files.controller';
import { WallpaperEntity } from '../../blogger/domain/wallpaper.entity';
import { UploadWallpaperUseCase } from '../../blogger/application/use-cases/upload-wallpaper.use-case';
import { FileStorageAdapter } from '../../../adapters/file-storage.adapter';
import { MainPictureEntity } from '../../blogger/domain/main-picture.entity';
import { UploadMainUseCase } from '../../blogger/application/use-cases/upload-main.use-case';
import { UploadPostMainUseCase } from '../../blogger/application/use-cases/upload-post-main.use-case';
import { PostMainPictureEntity } from '../../blogger/domain/post-main-picture.entity';
import { SubscribeToBlogUseCase } from '../../integrations/application/use-cases/subsrcibe-to-blog.use-case';
import { SubscriptionEntity } from '../../integrations/domain/subscription.entity';
import { TgAuthCodeEntity } from '../../integrations/domain/tg-auth-code.entity';
import { TelegramAdapter } from '../../../adapters/telegram.adapter';
import { UnsubscribeFromBlogUseCase } from '../../integrations/application/use-cases/unsubscribe-from-blog.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlogEntity,
      PostEntity,
      BlogOwnerInfoEntity,
      BlogBanInfoEntity,
      SaBlogBan,
      SaUserBan,
      UserBanForBlogEntity,
      UserBanInfo,
      Token,
      Device,
      SaBlogBan,
      Comment,
      WallpaperEntity,
      MainPictureEntity,
      PostMainPictureEntity,
      SubscriptionEntity,
      TgAuthCodeEntity,
    ]),
    CqrsModule,
    AuthModule,
    PostsModule,
    UsersModule,
    CommentsModule,
    DevicesModule,
    TokensModule,
  ],
  providers: [
    SubscribeToBlogUseCase,
    CreateBlogUseCase,
    UpdateBlogUseCase,
    DeleteBlogUseCase,
    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
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
    UploadWallpaperUseCase,
    UploadMainUseCase,
    UploadPostMainUseCase,
    FileStorageAdapter,
    TelegramAdapter,
    UnsubscribeFromBlogUseCase,
  ],
  controllers: [
    BloggerController,
    BloggerFilesController,
    BloggerUsersController,
    BlogsController,
    SuperAdminBlogsController,
  ],
  exports: [
    BlogsRepository,
    BlogsQueryRepository,
    SuperAdminBlogsService,
    BloggerCommentsQueryRepository,
  ],
})
export class BlogsModule {}
