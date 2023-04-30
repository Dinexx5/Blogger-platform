import { UsersRepository } from '../../../users/users.repository';
import { BanUserModelForBlog } from '../../../users/userModels';
import { BlogsRepository } from '../../../blogs/blogs.repository';
import { PostsRepository } from '../../../posts/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersBansForBlogRepository } from '../../../bans/bans.users-for-blog.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class BanUserForBlogCommand {
  constructor(
    public userId: string,
    public inputModel: BanUserModelForBlog,
    public ownerId: string,
  ) {}
}

@CommandHandler(BanUserForBlogCommand)
export class BanUserForBlogUseCase implements ICommandHandler<BanUserForBlogCommand> {
  constructor(
    protected usersRepository: UsersRepository,
    protected postsRepository: PostsRepository,
    protected blogsRepository: BlogsRepository,
    protected usersBansForBlogsRepository: UsersBansForBlogRepository,
  ) {}
  async execute(command: BanUserForBlogCommand): Promise<boolean> {
    const ownerId = command.ownerId;
    const userId = command.userId;
    const inputModel = command.inputModel;
    const blog = await this.blogsRepository.findBlogInstance(inputModel.blogId);
    if (!blog) throw new NotFoundException();
    const blogOwnerInfo = await this.blogsRepository.findBlogOwnerInfo(blog.id);
    if (blogOwnerInfo.userId.toString() !== ownerId) throw new ForbiddenException();
    const userToBan = await this.usersRepository.findUserById(userId);
    if (!userToBan) throw new NotFoundException();
    const login = userToBan.login;
    if (inputModel.isBanned === true) {
      const isBannedBefore = await this.usersBansForBlogsRepository.findBanByBlogAndUserId(
        inputModel.blogId,
        userId,
      );
      if (isBannedBefore) return;
      const bannedPostsIds = await this.postsRepository.findPostsForUser([inputModel.blogId]);
      const banDate = new Date().toISOString();
      await this.usersBansForBlogsRepository.createBan(
        userId,
        login,
        inputModel.blogId,
        inputModel.isBanned,
        inputModel.banReason,
        banDate,
        bannedPostsIds,
      );
      return;
    }
    const ban = await this.usersBansForBlogsRepository.findBanByBlogAndUserId(
      inputModel.blogId,
      userId,
    );
    if (!ban) return;
    await this.usersBansForBlogsRepository.unbanUser(userId, inputModel.blogId);
  }
}
