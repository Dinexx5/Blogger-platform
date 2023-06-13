import { UsersRepository } from '../../../admin/users/users.repository';
import { BanUserModelForBlog } from '../../../admin/users/user.models';
import { BlogsRepository } from '../../../public/blogs/blogs.repository';
import { PostsRepository } from '../../../public/posts/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogOwnerInfoEntity } from '../../domain/blog-owner-info.entity';
import { Repository } from 'typeorm';
import { User } from '../../../admin/users/domain/user.entity';
import { UserBanForBlogEntity } from '../../domain/user-ban-for-blog.entity';
import { CreateUserBanForBlogDto } from '../../dto/create-user-ban-for-blog.dto';

export class BanUserForBlogCommand {
  constructor(
    public userId: number,
    public inputModel: BanUserModelForBlog,
    public ownerId: number,
  ) {}
}

@CommandHandler(BanUserForBlogCommand)
export class BanUserForBlogUseCase implements ICommandHandler<BanUserForBlogCommand> {
  constructor(
    protected usersRepository: UsersRepository,
    protected postsRepository: PostsRepository,
    protected blogsRepository: BlogsRepository,
    @InjectRepository(BlogOwnerInfoEntity)
    private readonly blogOwnerInfoRepository: Repository<BlogOwnerInfoEntity>,
    @InjectRepository(UserBanForBlogEntity)
    private readonly usersBansForBlogsRepository: Repository<UserBanForBlogEntity>,
  ) {}
  async execute(command: BanUserForBlogCommand): Promise<boolean> {
    const ownerId = command.ownerId;
    const userId = command.userId;
    const inputModel = command.inputModel;

    const blogId = inputModel.blogId;
    const blog = await this.blogsRepository.findBlogById(blogId);
    if (!blog) throw new NotFoundException();

    const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
    if (blogOwnerInfo.userId !== ownerId) throw new ForbiddenException();

    const userToBan: User = await this.usersRepository.findUserById(userId);
    if (!userToBan) throw new NotFoundException();

    if (inputModel.isBanned === true) {
      const isBannedBefore = await this.usersBansForBlogsRepository.findOneBy({
        blogId: blogId,
        userId: userId,
      });
      if (isBannedBefore) return;
      const bannedPostsIds: number[] = await this.postsRepository.findPostsForUser([blogId]);

      const createUserForBlogBanDto: CreateUserBanForBlogDto = {
        userId,
        login: userToBan.login,
        blogId,
        banReason: inputModel.banReason,
        bannedPostsIds,
      };
      const ban = await UserBanForBlogEntity.createUserBanForBlog(createUserForBlogBanDto);
      await this.usersBansForBlogsRepository.save(ban);

      return;
    }
    const ban = await this.usersBansForBlogsRepository.findOneBy({
      blogId: blogId,
      userId: userId,
    });
    if (!ban) return;
    await this.usersBansForBlogsRepository.delete({ userId: userId, blogId: blogId });
  }
}
