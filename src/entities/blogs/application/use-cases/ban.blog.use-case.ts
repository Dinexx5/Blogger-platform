import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../posts/posts.repository';
import { BanBlogModel } from '../../blogs.models';
import { BlogBansRepository } from '../../../bans/bans.blogs.repository';
import { BlogsRepository } from '../../blogs.repository';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../../comments/domain/comment.entity';
import { Repository } from 'typeorm';
import { SaBlogBan } from '../../../bans/domain/saBlogBan.entity';
import { BlogBansInfo } from '../../domain/blogBansInfo.entity';

export class BanBlogCommand {
  constructor(public blogId: number, public inputModel: BanBlogModel) {}
}

@CommandHandler(BanBlogCommand)
export class BansBlogUseCase implements ICommandHandler<BanBlogCommand> {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    @InjectRepository(BlogBansInfo)
    private readonly blogBansInfoRepository: Repository<BlogBansInfo>,
    @InjectRepository(SaBlogBan)
    private readonly blogBansRepository: Repository<SaBlogBan>,
  ) {}
  async execute(command: BanBlogCommand): Promise<boolean> {
    const blogId = command.blogId;
    const inputModel = command.inputModel;
    const isBanned = inputModel.isBanned;
    const blog = await this.blogsRepository.findBlogById(blogId);
    if (!blog) throw new NotFoundException();
    if (isBanned === true) {
      const isBannedBefore = await this.blogBansRepository.findOneBy({ blogId: blogId });
      if (isBannedBefore) return;
      const banInfo = await this.blogBansInfoRepository.findOneBy({ blogId: blogId });
      banInfo.isBanned = true;
      banInfo.banDate = new Date().toISOString();
      await this.blogBansInfoRepository.save(banInfo);
      const bannedPostsIds = await this.postsRepository.findPostsForUser([blogId]);
      const newBan = await this.blogBansRepository.create();
      newBan.isBanned = true;
      newBan.bannedPostsIds = bannedPostsIds;
      newBan.blogId = blogId;
      await this.blogBansRepository.save(newBan);
      return;
    }
    const ban = await this.blogBansRepository.findOneBy({ blogId: blogId });
    if (!ban) {
      return;
    }
    const banInfo = await this.blogBansInfoRepository.findOneBy({ blogId: blogId });
    banInfo.isBanned = false;
    banInfo.banDate = null;
    await this.blogBansInfoRepository.save(banInfo);
    await this.blogBansRepository.remove(ban);
  }
}
