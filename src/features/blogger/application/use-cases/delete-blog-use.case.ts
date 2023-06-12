import { UsersRepository } from '../../../admin/users/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../../domain/blog.entity';
import { Repository } from 'typeorm';
import { BlogBanInfoEntity } from '../../domain/blog-ban-info.entity';
import { BlogOwnerInfoEntity } from '../../domain/blog-owner-info.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../../public/blogs/blogs.repository';
import { updateBlogDto } from '../../dto/update-blog-dto';

export class DeleteBlogCommand {
  constructor(public blogId: number, public userId: number) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(
    protected blogsRepository: BlogsRepository,
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

    const blog = await this.blogsRepository.findBlogById(blogId);
    if (!blog) throw new NotFoundException();
    const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
    if (blogOwnerInfo.userId !== userId) throw new ForbiddenException();

    await this.blogOwnerInfoRepository.remove(blogOwnerInfo);
    await this.blogBanInfoRepository.delete({ blogId: blogId });
    await this.blogsTypeOrmRepository.remove(blog);
  }
}
