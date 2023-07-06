import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../admin/users/users.repository';
import { BlogsService } from '../../../blogger/application/blogs.service';
import { SubscriptionEntity } from '../../domain/subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TgAuthCodeEntity } from '../../domain/tg-auth-code.entity';

export class SubscribeToBlogCommand {
  constructor(public blogId: number, public userId: number) {}
}

@CommandHandler(SubscribeToBlogCommand)
export class SubscribeToBlogUseCase implements ICommandHandler<SubscribeToBlogCommand> {
  constructor(
    protected blogsService: BlogsService,
    protected usersRepository: UsersRepository,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionsRepository: Repository<SubscriptionEntity>,
    @InjectRepository(TgAuthCodeEntity)
    private readonly tgAuthCodeRepository: Repository<TgAuthCodeEntity>,
  ) {}
  async execute(command: SubscribeToBlogCommand) {
    const { blogId, userId } = command;
    await this.blogsService.checkBlogExists(blogId);

    const IsUserSubscribedBefore = await this.tgAuthCodeRepository.findOneBy({ userId: userId });

    const subscription = await this.subscriptionsRepository.findOneBy({
      userId: userId,
      blogId: blogId,
    });

    if (subscription && subscription.status === 'Unsubscribed') {
      subscription.status = 'Subscribed';
      await this.subscriptionsRepository.save(subscription);
      return;
    }

    if (IsUserSubscribedBefore && IsUserSubscribedBefore.tgId && !subscription) {
      const newSubscription = await SubscriptionEntity.createSubscription(
        blogId,
        userId,
        IsUserSubscribedBefore.tgId,
      );
      await this.subscriptionsRepository.save(newSubscription);
      return;
    }

    const newSubscription = await SubscriptionEntity.createSubscription(blogId, userId);
    await this.subscriptionsRepository.save(newSubscription);
  }
}
