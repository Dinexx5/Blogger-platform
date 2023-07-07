import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../admin/users/users.repository';
import { BlogsService } from '../../../blogger/application/blogs.service';
import { SubscriptionEntity } from '../../domain/subscription.entity';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../../../blogger/domain/blog.entity';
import { Repository } from 'typeorm';
import { TgAuthCodeEntity } from '../../domain/tg-auth-code.entity';
import { ForbiddenException } from '@nestjs/common';

export class GetTgAuthLinkCommand {
  constructor(public userId: number) {}
}

@CommandHandler(GetTgAuthLinkCommand)
export class GetTgAuthLinkUseCase implements ICommandHandler<GetTgAuthLinkCommand> {
  constructor(
    protected usersRepository: UsersRepository,
    @InjectRepository(TgAuthCodeEntity)
    private readonly tgAuthCodesRepository: Repository<TgAuthCodeEntity>,
  ) {}
  async execute(command: GetTgAuthLinkCommand) {
    const userId = command.userId;
    const isAlreadyRegistered = await this.tgAuthCodesRepository.findOneBy({ userId: userId });

    if (isAlreadyRegistered) {
      throw new ForbiddenException();
    }

    const uniqueCode = uuidv4();
    const authLink = `https://t.me/blogger_platform_bot?code=${uniqueCode}`;
    const newAuthCode = await TgAuthCodeEntity.createAuthCode(uniqueCode, userId);
    await this.tgAuthCodesRepository.save(newAuthCode);
    return { link: authLink.toString() };
  }
}
