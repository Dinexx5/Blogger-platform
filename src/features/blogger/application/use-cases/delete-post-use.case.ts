import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../public/posts/posts.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../../../public/posts/domain/post.entity';
import { NotFoundException } from '@nestjs/common';
import { BlogsService } from '../blogs.service';

export class DeletePostCommand {
  constructor(public postId: number, public blogId: number, public userId: number) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(
    protected blogsService: BlogsService,
    protected postsRepository: PostsRepository,
    @InjectRepository(PostEntity)
    private readonly postsTypeOrmRepository: Repository<PostEntity>,
  ) {}

  async execute(command: DeletePostCommand) {
    const blogId = command.blogId;
    const userId = command.userId;
    const postId = command.postId;

    await this.blogsService.checkBlogId(blogId);
    await this.blogsService.checkPermission(blogId, userId);

    const post = await this.postsRepository.findPostInstance(postId);
    if (!post) throw new NotFoundException();

    await this.postsTypeOrmRepository.remove(post);
  }
}
