import { UpdatePostDto } from '../../dto/update-post.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../../../public/posts/domain/post.entity';
import { NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../../../public/posts/posts.repository';
import { BlogsService } from '../blogs.service';

export class UpdatePostCommand {
  constructor(
    public inputModel: UpdatePostDto,
    public postId: number,
    public blogId: number,
    public userId: number,
  ) {}
}
@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    protected blogsService: BlogsService,
    protected postsRepository: PostsRepository,
    @InjectRepository(PostEntity)
    private readonly postsTypeOrmRepository: Repository<PostEntity>,
  ) {}

  async execute(command: UpdatePostCommand) {
    const blogId = command.blogId;
    const userId = command.userId;
    const postId = command.postId;
    const inputModel = command.inputModel;

    await this.blogsService.checkBlogId(blogId);
    await this.blogsService.checkPermission(blogId, userId);

    const post = await this.postsRepository.findPostInstance(postId);
    if (!post) throw new NotFoundException();

    post.title = inputModel.title;
    post.shortDescription = inputModel.shortDescription;
    post.content = inputModel.content;
    post.blogId = blogId;

    await this.postsTypeOrmRepository.save(post);
  }
}
