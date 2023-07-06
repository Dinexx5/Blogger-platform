import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from '../blogger/domain/blog.entity';
import { BlogOwnerInfoEntity } from '../blogger/domain/blog-owner-info.entity';
import { BlogBanInfoEntity } from '../blogger/domain/blog-ban-info.entity';
import { SaBlogBan } from '../bans/domain/saBlogBan.entity';
import { SaUserBan } from '../bans/domain/saUserBan.entity';
import { UserBanForBlogEntity } from '../blogger/domain/user-ban-for-blog.entity';
import { UserBanInfo } from '../admin/users/domain/ban-info.entity';
import { Token } from '../tokens/domain/token.entity';
import { Device } from '../public/devices/domain/device.entity';
import { Attempt } from '../attempts/domain/attempt.entity';
import { Comment } from '../public/comments/domain/comment.entity';
import { CommentatorInfo } from '../public/comments/domain/commentatorInfo.entity';
import { PostInfoForComment } from '../public/comments/domain/postInfo.entity';
import { PostLike } from '../likes/domain/post-like.entity';
import { CommentLike } from '../likes/domain/comment-like.entity';
import { PostEntity } from '../public/posts/domain/post.entity';
import { User } from '../admin/users/domain/user.entity';
import { EmailConfirmationInfo } from '../admin/users/domain/email-confirmation.entity';
import { PasswordRecoveryInfo } from '../admin/users/domain/password-recovery.entity';
import { Question } from '../admin/questions/domain/question.entity';
import { PairGame } from '../public/pair-game/domain/pair-game.entity';
import { GamesStats } from '../public/pair-game/domain/stats.entity';
import { WallpaperEntity } from '../blogger/domain/wallpaper.entity';
import { MainPictureEntity } from '../blogger/domain/main-picture.entity';
import { PostMainPictureEntity } from '../blogger/domain/post-main-picture.entity';
import { TgAuthCodeEntity } from '../integrations/domain/tg-auth-code.entity';
import { SubscriptionEntity } from '../integrations/domain/subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TgAuthCodeEntity,
      SubscriptionEntity,
      WallpaperEntity,
      MainPictureEntity,
      PostMainPictureEntity,
      Attempt,
      BlogEntity,
      BlogOwnerInfoEntity,
      BlogBanInfoEntity,
      Comment,
      CommentatorInfo,
      EmailConfirmationInfo,
      PasswordRecoveryInfo,
      PostInfoForComment,
      PostLike,
      PostEntity,
      User,
      CommentLike,
      SaBlogBan,
      SaUserBan,
      UserBanForBlogEntity,
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
