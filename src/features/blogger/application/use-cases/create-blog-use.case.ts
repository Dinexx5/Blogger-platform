import { BlogViewModel } from '../../../public/blogs/blogs.models';
import { UsersRepository } from '../../../admin/users/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../../domain/blog.entity';
import { Repository } from 'typeorm';
import { BlogBanInfoEntity } from '../../domain/blog-ban-info.entity';
import { BlogOwnerInfoEntity } from '../../domain/blog-owner-info.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogDto } from '../../dto/create.blog.dto.to';

export class CreateBlogCommand {
  constructor(public inputModel: CreateBlogDto, public userId: number) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    protected usersRepository: UsersRepository,
    @InjectRepository(BlogEntity)
    private readonly blogsTypeOrmRepository: Repository<BlogEntity>,
    @InjectRepository(BlogBanInfoEntity)
    private readonly blogBanInfoRepository: Repository<BlogBanInfoEntity>,
    @InjectRepository(BlogOwnerInfoEntity)
    private readonly blogOwnerInfoRepository: Repository<BlogOwnerInfoEntity>,
  ) {}

  async execute(command: CreateBlogCommand): Promise<BlogViewModel> {
    const userId = command.userId;
    const inputModel = command.inputModel;

    const user = await this.usersRepository.findUserById(userId);

    const blog = await BlogEntity.createBlog(inputModel);
    await this.blogsTypeOrmRepository.save(blog);

    const blogBanInfo = await BlogBanInfoEntity.createBlogBanInfo(blog.id);
    await this.blogBanInfoRepository.save(blogBanInfo);

    const blogOwnerInfo = await BlogOwnerInfoEntity.createBlogOwnerInfo(
      blog.id,
      userId,
      user.login,
    );
    await this.blogOwnerInfoRepository.save(blogOwnerInfo);

    return {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: blog.isMembership,
      createdAt: blog.createdAt,
      id: blog.id.toString(),
    };
  }
}
