import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../admin/users/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogsService } from '../../../blogger/application/blogs.service';
import { SubscriptionEntity } from '../../domain/subscription.entity';
import { NotFoundException } from '@nestjs/common';

export class UnsubscribeFromBlogCommand {
  constructor(public blogId: number, public userId: number) {}
}

@CommandHandler(UnsubscribeFromBlogCommand)
export class UnsubscribeFromBlogUseCase implements ICommandHandler<UnsubscribeFromBlogCommand> {
  constructor(
    protected blogsService: BlogsService,
    protected usersRepository: UsersRepository,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionsRepository: Repository<SubscriptionEntity>,
  ) {}
  async execute(command: UnsubscribeFromBlogCommand) {
    const { blogId, userId } = command;

    await this.blogsService.checkBlogExists(blogId);

    const subscriptionToModify = await this.subscriptionsRepository.findOneBy({
      blogId: blogId,
      userId: userId,
    });
    if (!subscriptionToModify) {
      throw new NotFoundException();
    }
    subscriptionToModify.status = 'Unsubscribed';
    await this.subscriptionsRepository.save(subscriptionToModify);
  }
}
