import { UsersRepository } from '../../../admin/users/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../../domain/blog.entity';
import { Repository } from 'typeorm';
import { BlogBanInfoEntity } from '../../domain/blog-ban-info.entity';
import { BlogOwnerInfoEntity } from '../../domain/blog-owner-info.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { updateBlogDto } from '../../dto/update-blog-dto';
import { BlogsService } from '../blogs.service';

export class UpdateBlogCommand {
  constructor(public inputModel: updateBlogDto, public blogId: number, public userId: number) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(
    protected blogsService: BlogsService,
    protected usersRepository: UsersRepository,
    @InjectRepository(BlogEntity)
    private readonly blogsTypeOrmRepository: Repository<BlogEntity>,
    @InjectRepository(BlogBanInfoEntity)
    private readonly blogBanInfoRepository: Repository<BlogBanInfoEntity>,
    @InjectRepository(BlogOwnerInfoEntity)
    private readonly blogOwnerInfoRepository: Repository<BlogOwnerInfoEntity>,
  ) {}

  async execute(command: UpdateBlogCommand) {
    const blogBody = command.inputModel;
    const blogId = command.blogId;
    const userId = command.userId;

    const blog = await this.blogsService.checkBlogExists(blogId);
    await this.blogsService.checkPermission(blogId, userId);

    const { name, description, websiteUrl } = blogBody;

    blog.name = name;
    blog.description = description;
    blog.websiteUrl = websiteUrl;

    await this.blogsTypeOrmRepository.save(blog);
  }
}
