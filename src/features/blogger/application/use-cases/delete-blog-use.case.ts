import { UsersRepository } from '../../../admin/users/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../../domain/blog.entity';
import { Repository } from 'typeorm';
import { BlogBanInfoEntity } from '../../domain/blog-ban-info.entity';
import { BlogOwnerInfoEntity } from '../../domain/blog-owner-info.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsService } from '../blogs.service';

export class DeleteBlogCommand {
  constructor(public blogId: number, public userId: number) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
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

  async execute(command: DeleteBlogCommand) {
    const blogId = command.blogId;
    const userId = command.userId;

    const blog = await this.blogsService.checkBlogExists(blogId);
    const blogOwnerInfo = await this.blogsService.checkPermission(blogId, userId);

    await this.blogOwnerInfoRepository.remove(blogOwnerInfo);
    await this.blogBanInfoRepository.delete({ blogId: blogId });
    await this.blogsTypeOrmRepository.remove(blog);
  }
}
