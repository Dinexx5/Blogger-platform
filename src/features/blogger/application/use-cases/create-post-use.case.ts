import { CreatePostDto } from '../../dto/create-post-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository, IsNull } from 'typeorm';
import { PostViewModel } from '../../../public/posts/posts.models';
import { PostEntity } from '../../../public/posts/domain/post.entity';
import { BlogsService } from '../blogs.service';
import { SubscriptionEntity } from '../../../integrations/domain/subscription.entity';
import { TelegramAdapter } from '../../../../adapters/telegram.adapter';

export class CreatePostCommand {
  constructor(public inputModel: CreatePostDto, public blogId: number, public userId: number) {}
}
@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    protected blogsService: BlogsService,
    protected telegramAdapter: TelegramAdapter,
    @InjectRepository(PostEntity)
    private readonly postsTypeOrmRepository: Repository<PostEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionsRepository: Repository<SubscriptionEntity>,
  ) {}

  async execute(command: CreatePostCommand): Promise<PostViewModel> {
    const { blogId, userId, inputModel } = command;

    const blog = await this.blogsService.checkBlogExists(blogId);
    await this.blogsService.checkPermission(blogId, userId);

    const post = await PostEntity.createPost(inputModel, blogId, blog.name);
    await this.postsTypeOrmRepository.save(post);

    const subscriptions: SubscriptionEntity[] = await this.subscriptionsRepository.find({
      where: {
        blogId: blogId,
        tgId: Not(IsNull()),
        status: 'Subscribed',
      },
    });

    const recipientsIds = subscriptions.map((subs) => subs.tgId);

    for (let i = 0; i < recipientsIds.length; i++) {
      const tgId = recipientsIds[i];
      await this.telegramAdapter.sendNotificationMessage(blog.name, +tgId);
    }

    return {
      id: post.id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId.toString(),
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
      images: { main: [] },
    };
  }
}
