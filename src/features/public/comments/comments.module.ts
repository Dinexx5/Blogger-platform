import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../../admin/users/users.module';
import { CommentsController } from './comments.controller';
import { CommentsQueryRepository } from './comments.query-repo';
import { CommentsRepository } from './comments.repository';
import { CommentsService } from './comments.service';
import { PostsService } from '../posts/posts.service';
import { PostsRepository } from '../posts/posts.repository';
import { BlogsQueryRepository } from '../blogs/blogs.query-repo';
import { IsLikeStatusCorrectDecorator } from '../../../shared/decorators/validation/like-status.decorator';
import { BlogsRepository } from '../blogs/blogs.repository';
import { BansUserUseCase } from '../../bans/application/use-cases/ban.user.use.case.';
import { BansRepository } from '../../bans/bans.repository';
import { DevicesModule } from '../devices/devices.module';
import { TokensModule } from '../../tokens/token.module';
import { BlogBansRepository } from '../../bans/bans.blogs.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersBansForBlogRepository } from '../../bans/bans.users-for-blog.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './domain/comment.entity';
import { CommentLike } from '../../likes/domain/comment-like.entity';
import { CommentatorInfo } from './domain/commentatorInfo.entity';
import { PostInfoForComment } from './domain/postInfo.entity';
import { PostLike } from '../../likes/domain/post-like.entity';
import { BlogOwnerInfoEntity } from '../../blogger/domain/blog-owner-info.entity';
import { PostEntity } from '../posts/domain/post.entity';
import { BlogEntity } from '../../blogger/domain/blog.entity';
import { UserBanInfo } from '../../admin/users/domain/ban-info.entity';
import { Token } from '../../tokens/domain/token.entity';
import { SaUserBan } from '../../bans/domain/saUserBan.entity';
import { Device } from '../devices/domain/device.entity';
import { UserBanForBlogEntity } from '../../blogger/domain/user-ban-for-blog.entity';
import { SaBlogBan } from '../../bans/domain/saBlogBan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlogEntity,
      Comment,
      CommentatorInfo,
      PostInfoForComment,
      PostEntity,
      PostLike,
      CommentLike,
      BlogOwnerInfoEntity,
      UserBanInfo,
      Token,
      SaUserBan,
      Device,
      UserBanForBlogEntity,
      SaBlogBan,
    ]),
    CqrsModule,
    AuthModule,
    UsersModule,
    DevicesModule,
    TokensModule,
  ],
  providers: [
    CommentsQueryRepository,
    CommentsRepository,
    CommentsService,
    PostsService,
    PostsRepository,
    BlogsQueryRepository,
    BlogsRepository,
    IsLikeStatusCorrectDecorator,
    BansUserUseCase,
    BansRepository,
    BlogBansRepository,
    UsersBansForBlogRepository,
  ],
  controllers: [CommentsController],
  exports: [
    CommentsQueryRepository,
    CommentsRepository,
    CommentsService,
    PostsService,
    PostsRepository,
    BlogsQueryRepository,
    BlogsRepository,
    IsLikeStatusCorrectDecorator,
  ],
})
export class CommentsModule {}
