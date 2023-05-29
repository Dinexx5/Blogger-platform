import { UsersRepository } from '../../../admin/users/users.repository';
import { BanUserModelForBlog } from '../../../admin/users/user.models';
import { BlogsRepository } from '../../../public/blogs/blogs.repository';
import { PostsRepository } from '../../../public/posts/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogOwnerInfo } from '../../../public/blogs/domain/blog-owner-info.entity';
import { Repository } from 'typeorm';
import { User } from '../../../admin/users/domain/user.entity';
import { UserBanForBlog } from '../../domain/userBanForBlog.entity';

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
    @InjectRepository(BlogOwnerInfo)
    private readonly blogOwnerInfoRepository: Repository<BlogOwnerInfo>,
    @InjectRepository(UserBanForBlog)
    private readonly usersBansForBlogsRepository: Repository<UserBanForBlog>,
  ) {}
  async execute(command: BanUserForBlogCommand): Promise<boolean> {
    const ownerId = command.ownerId;
    const userId = command.userId;
    const inputModel = command.inputModel;
    const blogId = +inputModel.blogId;
    const blog = await this.blogsRepository.findBlogById(blogId);
    if (!blog) throw new NotFoundException();
    const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
    if (blogOwnerInfo.userId !== ownerId) throw new ForbiddenException();
    const userToBan: User = await this.usersRepository.findUserById(userId);
    if (!userToBan) throw new NotFoundException();
    const login = userToBan.login;
    if (inputModel.isBanned === true) {
      const isBannedBefore = await this.usersBansForBlogsRepository.findOneBy({
        blogId: blogId,
        userId: userId,
      });
      if (isBannedBefore) return;
      const bannedPostsIds: number[] = await this.postsRepository.findPostsForUser([blogId]);
      const ban = await this.usersBansForBlogsRepository.create();
      ban.userId = userId;
      ban.login = login;
      ban.blogId = blogId;
      ban.isBanned = true;
      ban.banReason = inputModel.banReason;
      ban.banDate = new Date().toISOString();
      ban.bannedPostsIds = bannedPostsIds;
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
