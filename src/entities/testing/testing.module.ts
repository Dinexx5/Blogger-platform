import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from '../public/blogs/domain/blog.entity';
import { BlogOwnerInfo } from '../public/blogs/domain/blog-owner-info.entity';
import { BlogBansInfo } from '../public/blogs/domain/blog-bans-info.entity';
import { SaBlogBan } from '../bans/domain/saBlogBan.entity';
import { SaUserBan } from '../bans/domain/saUserBan.entity';
import { UserBanForBlog } from '../blogger/domain/userBanForBlog.entity';
import { UserBanInfo } from '../admin/users/domain/ban-info.entity';
import { Token } from '../tokens/domain/token.entity';
import { Device } from '../public/devices/domain/device.entity';
import { Attempt } from '../attempts/domain/attempt.entity';
import { Comment } from '../public/comments/domain/comment.entity';
import { CommentatorInfo } from '../public/comments/domain/commentatorInfo.entity';
import { PostInfoForComment } from '../public/comments/domain/postInfo.entity';
import { PostLike } from '../likes/domain/post-like.entity';
import { CommentLike } from '../likes/domain/comment-like.entity';
import { Post } from '../public/posts/domain/post.entity';
import { User } from '../admin/users/domain/user.entity';
import { EmailConfirmationInfo } from '../admin/users/domain/email-confirmation.entity';
import { PasswordRecoveryInfo } from '../admin/users/domain/password-recovery.entity';
import { Question } from '../admin/questions/domain/question.entity';
import { PairGame } from '../public/pair-game/domain/pair-game.entity';
import { GamesStats } from '../public/pair-game/domain/stats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Attempt,
      Blog,
      BlogOwnerInfo,
      BlogBansInfo,
      Comment,
      CommentatorInfo,
      EmailConfirmationInfo,
      PasswordRecoveryInfo,
      PostInfoForComment,
      PostLike,
      Post,
      User,
      CommentLike,
      SaBlogBan,
      SaUserBan,
      UserBanForBlog,
      UserBanInfo,
      Token,
      Device,
      Question,
      PairGame,
      GamesStats,
    ]),
  ],
  providers: [],
  controllers: [TestingController],
  exports: [],
})
export class TestingModule {}
