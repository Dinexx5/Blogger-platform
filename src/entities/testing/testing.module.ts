import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from '../blogs/domain/blog.entity';
import { BlogOwnerInfo } from '../blogs/domain/blogOwner.entity';
import { BlogBansInfo } from '../blogs/domain/blogBansInfo.entity';
import { SaBlogBan } from '../bans/domain/saBlogBan.entity';
import { SaUserBan } from '../bans/domain/saUserBan.entity';
import { UserBanForBlog } from '../blogger/domain/userBanForBlog.entity';
import { UserBanInfo } from '../users/domain/banInfo.entity';
import { Token } from '../tokens/domain/token.entity';
import { Device } from '../devices/domain/device.entity';
import { Attempt } from '../attempts/domain/attempt.entity';
import { Comment } from '../comments/domain/comment.entity';
import { CommentatorInfo } from '../comments/domain/commentatorInfo.entity';
import { PostInfoForComment } from '../comments/domain/postInfo.entity';
import { PostLike } from '../likes/domain/postLike.entity';
import { CommentLike } from '../likes/domain/commentLike.entity';
import { Post } from '../posts/domain/post.entity';
import { User } from '../users/domain/user.entity';
import { EmailConfirmationInfo } from '../users/domain/emailConfirmation.entity';
import { PasswordRecoveryInfo } from '../users/domain/passwordRecovery.entity';
import { Question } from '../quiz/domain/question.entity';
import { PairGame } from '../quiz/domain/pair-game.entity';

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
    ]),
  ],
  providers: [],
  controllers: [TestingController],
  exports: [],
})
export class TestingModule {}
