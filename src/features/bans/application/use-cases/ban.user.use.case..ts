import { UsersRepository } from '../../../admin/users/users.repository';
import { BanModel } from '../../../admin/users/user.models';
import { BansRepository } from '../../bans.repository';
import { BlogsRepository } from '../../../public/blogs/blogs.repository';
import { PostsRepository } from '../../../public/posts/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../admin/users/domain/user.entity';
import { Repository } from 'typeorm';
import { UserBanInfo } from '../../../admin/users/domain/ban-info.entity';
import { Token } from '../../../tokens/domain/token.entity';
import { Device } from '../../../public/devices/domain/device.entity';
import { SaUserBan } from '../../domain/saUserBan.entity';
import { CommentsRepository } from '../../../public/comments/comments.repository';

export class BanUserCommand {
  constructor(public userId: number, public inputModel: BanModel) {}
}

@CommandHandler(BanUserCommand)
export class BansUserUseCase implements ICommandHandler<BanUserCommand> {
  constructor(
    @InjectRepository(UserBanInfo)
    private readonly userBanInfoRepository: Repository<UserBanInfo>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    protected usersRepository: UsersRepository,
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    protected commentsRepository: CommentsRepository,
    protected bansRepository: BansRepository,
    @InjectRepository(SaUserBan)
    private readonly bansTypeOrmRepository: Repository<SaUserBan>,
    @InjectRepository(Device)
    private readonly devicesRepository: Repository<Device>,
  ) {}
  async execute(command: BanUserCommand): Promise<boolean> {
    const userId = command.userId;
    const inputModel = command.inputModel;
    const user: User = await this.usersRepository.findUserById(userId);
    const login = user.login;

    if (inputModel.isBanned === true) {
      const isBannedBefore = await this.bansRepository.isUserBanned(userId);
      if (isBannedBefore) return;

      const userBanInfo = await this.userBanInfoRepository.findOneBy({ userId: userId });
      const banDate = new Date().toISOString();
      userBanInfo.isBanned = true;
      userBanInfo.banDate = banDate;
      userBanInfo.banReason = inputModel.banReason;
      await this.userBanInfoRepository.save(userBanInfo);

      await this.devicesRepository.delete({ userId: userId });

      await this.tokenRepository.delete({ userId: userId });

      const bannedBlogsIds = await this.blogsRepository.findBlogsForUser(userId);
      const bannedPostsIds = await this.postsRepository.findPostsForUser(bannedBlogsIds);
      const bannedCommentsIds = await this.commentsRepository.findBannedComments(userId);

      const ban = await this.bansTypeOrmRepository.create();
      ban.userId = userId;
      ban.login = login;
      ban.isBanned = true;
      ban.banReason = inputModel.banReason;
      ban.bannedBlogsIds = bannedBlogsIds;
      ban.bannedPostsIds = bannedPostsIds;
      ban.bannedCommentsIds = bannedCommentsIds;
      await this.bansTypeOrmRepository.save(ban);

      return;
    }
    const banInstance = await this.bansRepository.isUserBanned(userId);
    if (!banInstance) {
      return;
    }

    const userBanInfo = await this.userBanInfoRepository.findOneBy({ userId: userId });
    userBanInfo.isBanned = false;
    userBanInfo.banDate = null;
    userBanInfo.banReason = null;
    await this.userBanInfoRepository.save(userBanInfo);

    await this.bansTypeOrmRepository.delete({ userId: userId });
  }
}
