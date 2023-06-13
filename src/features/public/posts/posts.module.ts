import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { PostsQueryRepository } from './posts.query-repo';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersModule } from '../../admin/users/users.module';
import { BlogsQueryRepository } from '../blogs/blogs.query-repo';
import { CommentsModule } from '../comments/comments.module';
import { BlogsRepository } from '../blogs/blogs.repository';
import { BansUserUseCase } from '../../bans/application/use-cases/ban.user.use.case.';
import { BansRepository } from '../../bans/bans.repository';
import { DevicesModule } from '../devices/devices.module';
import { TokensModule } from '../../tokens/token.module';
import { BlogBansRepository } from '../../bans/bans.blogs.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersBansForBlogRepository } from '../../bans/bans.users-for-blog.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './domain/post.entity';
import { PostLike } from '../../likes/domain/post-like.entity';
import { BlogOwnerInfoEntity } from '../../blogger/domain/blog-owner-info.entity';
import { BlogEntity } from '../../blogger/domain/blog.entity';
import { UserBanInfo } from '../../admin/users/domain/ban-info.entity';
import { Token } from '../../tokens/domain/token.entity';
import { Device } from '../devices/domain/device.entity';
import { SaUserBan } from '../../bans/domain/saUserBan.entity';
import { UserBanForBlogEntity } from '../../blogger/domain/user-ban-for-blog.entity';
import { SaBlogBan } from '../../bans/domain/saBlogBan.entity';
import { CreatePostUseCase } from '../../blogger/application/use-cases/create-post-use.case';
import { UpdatePostUseCase } from '../../blogger/application/use-cases/update-post-use.case';
import { DeletePostUseCase } from '../../blogger/application/use-cases/delete-post-use.case';
import { BlogsService } from '../../blogger/application/blogs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      PostLike,
      BlogOwnerInfoEntity,
      BlogEntity,
      UserBanInfo,
      Token,
      Device,
      SaUserBan,
      UserBanForBlogEntity,
      SaBlogBan,
    ]),
    CqrsModule,
    AuthModule,
    UsersModule,
    CommentsModule,
    DevicesModule,
    TokensModule,
  ],
  providers: [
    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    BlogsService,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    BlogsQueryRepository,
    BlogsRepository,
    BansUserUseCase,
    BansRepository,
    BlogBansRepository,
    UsersBansForBlogRepository,
  ],
  controllers: [PostsController],
  exports: [
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    BlogsQueryRepository,
    BlogsRepository,
  ],
})
export class PostsModule {}
