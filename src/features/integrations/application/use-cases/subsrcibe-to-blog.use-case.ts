import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../admin/users/users.repository';
import { BlogsService } from '../../../blogger/application/blogs.service';
import { SubscriptionEntity } from '../../domain/subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
  ) {}
  async execute(command: SubscribeToBlogCommand) {
    const { blogId, userId } = command;
    await this.blogsService.checkBlogExists(blogId);
    const newSubscription = await SubscriptionEntity.createSubscription(blogId, userId);
    await this.subscriptionsRepository.save(newSubscription);
  }
}
