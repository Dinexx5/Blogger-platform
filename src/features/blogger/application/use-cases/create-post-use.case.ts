import { CreatePostDto } from '../../dto/create-post-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostViewModel } from '../../../public/posts/posts.models';
import { PostEntity } from '../../../public/posts/domain/post.entity';
import { BlogsService } from '../blogs.service';

export class CreatePostCommand {
  constructor(public inputModel: CreatePostDto, public blogId: number, public userId: number) {}
}
@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    protected blogsService: BlogsService,
    @InjectRepository(PostEntity)
    private readonly postsTypeOrmRepository: Repository<PostEntity>,
  ) {}

  async execute(command: CreatePostCommand): Promise<PostViewModel> {
    const blogId = command.blogId;
    const userId = command.userId;
    const inputModel = command.inputModel;

    const blog = await this.blogsService.checkBlogId(blogId);
    await this.blogsService.checkPermission(blogId, userId);

    const post = await PostEntity.createPost(inputModel, blogId, blog.name);
    await this.postsTypeOrmRepository.save(post);

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
    };
  }
}
