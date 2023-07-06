import { Controller, Delete, Res } from '@nestjs/common';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../admin/users/domain/user.entity';
import { Attempt } from '../attempts/domain/attempt.entity';
import { BlogBanInfoEntity } from '../blogger/domain/blog-ban-info.entity';
import { BlogOwnerInfoEntity } from '../blogger/domain/blog-owner-info.entity';
import { CommentatorInfo } from '../public/comments/domain/commentatorInfo.entity';
import { PostInfoForComment } from '../public/comments/domain/postInfo.entity';
import { Device } from '../public/devices/domain/device.entity';
import { PostLike } from '../likes/domain/post-like.entity';
import { CommentLike } from '../likes/domain/comment-like.entity';
import { Token } from '../tokens/domain/token.entity';
import { SaBlogBan } from '../bans/domain/saBlogBan.entity';
import { SaUserBan } from '../bans/domain/saUserBan.entity';
import { UserBanInfo } from '../admin/users/domain/ban-info.entity';
import { EmailConfirmationInfo } from '../admin/users/domain/email-confirmation.entity';
import { PasswordRecoveryInfo } from '../admin/users/domain/password-recovery.entity';
import { UserBanForBlogEntity } from '../blogger/domain/user-ban-for-blog.entity';
import { Comment } from '../public/comments/domain/comment.entity';
import { PostEntity } from '../public/posts/domain/post.entity';
import { BlogEntity } from '../blogger/domain/blog.entity';
import { Question } from '../admin/questions/domain/question.entity';
import { PairGame } from '../public/pair-game/domain/pair-game.entity';
import { GamesStats } from '../public/pair-game/domain/stats.entity';
import { WallpaperEntity } from '../blogger/domain/wallpaper.entity';
import { MainPictureEntity } from '../blogger/domain/main-picture.entity';
import { PostMainPictureEntity } from '../blogger/domain/post-main-picture.entity';
import { SubscriptionEntity } from '../integrations/domain/subscription.entity';
import { TgAuthCodeEntity } from '../integrations/domain/tg-auth-code.entity';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptions: Repository<SubscriptionEntity>,
    @InjectRepository(TgAuthCodeEntity)
    private readonly tgAuthCodes: Repository<TgAuthCodeEntity>,
    @InjectRepository(WallpaperEntity)
    private readonly wallpapers: Repository<WallpaperEntity>,
    @InjectRepository(MainPictureEntity)
    private readonly mainPictures: Repository<MainPictureEntity>,
    @InjectRepository(PostMainPictureEntity)
    private readonly postMainPictures: Repository<PostMainPictureEntity>,
    @InjectRepository(Attempt)
    private readonly attempts: Repository<Attempt>,
    @InjectRepository(PairGame)
    private readonly pairGames: Repository<PairGame>,
    @InjectRepository(BlogBanInfoEntity)
    private readonly blogBansInfo: Repository<BlogBanInfoEntity>,
    @InjectRepository(BlogOwnerInfoEntity)
    private readonly blogOwners: Repository<BlogOwnerInfoEntity>,
    @InjectRepository(CommentatorInfo)
    private readonly commentatorInfo: Repository<CommentatorInfo>,
    @InjectRepository(PostInfoForComment)
    private readonly postInfo: Repository<PostInfoForComment>,
    @InjectRepository(Device)
    private readonly devices: Repository<Device>,
    @InjectRepository(PostLike)
    private readonly postsLikes: Repository<PostLike>,
    @InjectRepository(CommentLike)
    private readonly commentsLikes: Repository<CommentLike>,
    @InjectRepository(Token)
    private readonly tokens: Repository<Token>,
    @InjectRepository(SaBlogBan)
    private readonly blogBans: Repository<SaBlogBan>,
    @InjectRepository(SaUserBan)
    private readonly userBans: Repository<SaUserBan>,
    @InjectRepository(UserBanInfo)
    private readonly userBansInfo: Repository<UserBanInfo>,
    @InjectRepository(EmailConfirmationInfo)
    private readonly emailConfirmationInfo: Repository<EmailConfirmationInfo>,
    @InjectRepository(PasswordRecoveryInfo)
    private readonly passwordRecoveryInfo: Repository<PasswordRecoveryInfo>,
    @InjectRepository(UserBanForBlogEntity)
    private readonly userBansForBlog: Repository<UserBanForBlogEntity>,
    @InjectRepository(GamesStats)
    private readonly gamesStats: Repository<GamesStats>,
    @InjectRepository(Comment)
    private readonly comments: Repository<Comment>,
    @InjectRepository(PostEntity)
    private readonly posts: Repository<PostEntity>,
    @InjectRepository(BlogEntity)
    private readonly blogs: Repository<BlogEntity>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Question)
    private readonly questions: Repository<Question>,
  ) {}
  @Delete('all-data')
  async deleteAll(@Res() res: Response) {
    await this.subscriptions.delete({});
    await this.tgAuthCodes.delete({});
    await this.wallpapers.delete({});
    await this.mainPictures.delete({});
    await this.postMainPictures.delete({});
    await this.questions.delete({});
    await this.attempts.delete({});
    await this.blogBansInfo.delete({});
    await this.blogOwners.delete({});
    await this.commentatorInfo.delete({});
    await this.postInfo.delete({});
    await this.devices.delete({});
    await this.postsLikes.delete({});
    await this.commentsLikes.delete({});
    await this.tokens.delete({});
    await this.blogBans.delete({});
    await this.userBans.delete({});
    await this.userBansInfo.delete({});
    await this.emailConfirmationInfo.delete({});
    await this.passwordRecoveryInfo.delete({});
    await this.userBansForBlog.delete({});
    await this.gamesStats.delete({});
    await this.comments.delete({});
    await this.posts.delete({});
    await this.blogs.delete({});
    await this.pairGames.delete({});
    await this.users.delete({});
    return res.sendStatus(204);
  }
}
