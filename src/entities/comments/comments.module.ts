import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CommentsController } from './comments.controller';
import { CommentsQueryRepository } from './comments.query-repo';
import { CommentsRepository } from './comments.repository';
import { CommentsService } from './comments.service';
import { PostsService } from '../posts/posts.service';
import { PostsRepository } from '../posts/posts.repository';
import { BlogsQueryRepository } from '../blogs/blogs.query-repo';
import { IsLikeStatusCorrectDecorator } from '../../shared/decorators/validation/like-status.decorator';
import { BlogsRepository } from '../blogs/blogs.repository';
import { BansUserUseCase } from '../bans/application/use-cases/ban.user.use.case.';
import { BansRepository } from '../bans/bans.repository';
import { DevicesModule } from '../devices/devices.module';
import { TokensModule } from '../tokens/token.module';
import { CommentsLikesRepository } from '../likes/comments.likes.repository';
import { PostsLikesRepository } from '../likes/posts.likes.repository';
import { BlogBansRepository } from '../bans/bans.blogs.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersBansForBlogRepository } from '../bans/bans.users-for-blog.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './domain/comment.entity';
import { CommentLike } from '../likes/domain/commentLike.entity';
import { CommentatorInfo } from './domain/commentatorInfo.entity';
import { PostInfoForComment } from './domain/postInfo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, CommentLike, CommentatorInfo, PostInfoForComment]),
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
    CommentsLikesRepository,
    PostsLikesRepository,
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
    CommentsLikesRepository,
    PostsLikesRepository,
  ],
})
export class CommentsModule {}
