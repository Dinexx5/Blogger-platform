import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../admin/users/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionEntity } from '../../domain/subscription.entity';
import { TgAuthCodeEntity } from '../../domain/tg-auth-code.entity';
import { TelegramAdapter } from '../../../../adapters/telegram.adapter';

export class HandleRegistrationMessageCommand {
  constructor(public tgId: number, public code: string) {}
}

@CommandHandler(HandleRegistrationMessageCommand)
export class HandleRegistrationMessageUseCase
  implements ICommandHandler<HandleRegistrationMessageCommand>
{
  constructor(
    protected usersRepository: UsersRepository,
    protected TelegramAdapter: TelegramAdapter,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionsRepository: Repository<SubscriptionEntity>,
    @InjectRepository(TgAuthCodeEntity)
    private readonly tgAuthRepository: Repository<TgAuthCodeEntity>,
  ) {}
  async execute(command: HandleRegistrationMessageCommand) {
    const { tgId, code } = command;

    const authEntity = await this.tgAuthRepository.findOneBy({ code: code });
    if (!authEntity) {
      await this.TelegramAdapter.sendMessage(
        'you need to receive invitational link first or your code is incorrect',
        tgId,
      );
      return;
    }
    if (authEntity.tgId) {
      await this.TelegramAdapter.sendMessage('you have already activated your subscription', tgId);
      return;
    }
    authEntity.tgId = tgId;
    await this.tgAuthRepository.save(authEntity);
    await this.subscriptionsRepository
      .createQueryBuilder()
      .update(SubscriptionEntity)
      .set({ tgId: tgId })
      .where('userId = :id', { id: authEntity.userId })
      .execute();
    await this.TelegramAdapter.sendMessage('successfully subscribed', tgId);
  }
}
