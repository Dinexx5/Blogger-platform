import { Controller, Delete, Res } from '@nestjs/common';
import { Response } from 'express';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/domain/user.entity';
import { Attempt } from '../attempts/domain/attempt.entity';
import { BlogBansInfo } from '../blogs/domain/blogBansInfo.entity';
import { BlogOwnerInfo } from '../blogs/domain/blogOwner.entity';
import { CommentatorInfo } from '../comments/domain/commentatorInfo.entity';
import { PostInfoForComment } from '../comments/domain/postInfo.entity';
import { Device } from '../devices/domain/device.entity';
import { PostLike } from '../likes/domain/postLike.entity';
import { CommentLike } from '../likes/domain/commentLike.entity';
import { Token } from '../tokens/domain/token.entity';
import { SaBlogBan } from '../bans/domain/saBlogBan.entity';
import { SaUserBan } from '../bans/domain/saUserBan.entity';
import { UserBanInfo } from '../users/domain/banInfo.entity';
import { EmailConfirmationInfo } from '../users/domain/emailConfirmation.entity';
import { PasswordRecoveryInfo } from '../users/domain/passwordRecovery.entity';
import { UserBanForBlog } from '../blogger/domain/userBanForBlog.entity';
import { Comment } from '../comments/domain/comment.entity';
import { Post } from '../posts/domain/post.entity';
import { Blog } from '../blogs/domain/blog.entity';
import { Question } from '../quiz/domain/question.entity';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectRepository(Attempt)
    private readonly attempts: Repository<Attempt>,
    @InjectRepository(BlogBansInfo)
    private readonly blogBansInfo: Repository<BlogBansInfo>,
    @InjectRepository(BlogOwnerInfo)
    private readonly blogOwners: Repository<BlogOwnerInfo>,
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
    @InjectRepository(UserBanForBlog)
    private readonly userBansForBlog: Repository<UserBanForBlog>,
    @InjectRepository(Comment)
    private readonly comments: Repository<Comment>,
    @InjectRepository(Post)
    private readonly posts: Repository<Post>,
    @InjectRepository(Blog)
    private readonly blogs: Repository<Blog>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Question)
    private readonly questions: Repository<Question>,
  ) {}
  @Delete('all-data')
  async deleteAll(@Res() res: Response) {
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
    await this.comments.delete({});
    await this.posts.delete({});
    await this.blogs.delete({});
    await this.users.delete({});
    return res.sendStatus(204);
  }
}
