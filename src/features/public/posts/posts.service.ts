import { PostsRepository } from './posts.repository';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentsService } from '../comments/comments.service';
import { UsersRepository } from '../../admin/users/users.repository';
import { UsersBansForBlogRepository } from '../../bans/bans.users-for-blog.repository';
import { CommentViewModel, UpdateCommentModel } from '../comments/comments.models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLike } from '../../likes/domain/post-like.entity';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected commentsService: CommentsService,
    protected usersRepository: UsersRepository,
    protected usersBansForBlogsRepo: UsersBansForBlogRepository,
    @InjectRepository(PostLike)
    private readonly postsLikesRepository: Repository<PostLike>,
  ) {}
  async checkPostExists(postId: number) {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new NotFoundException();
    return post;
  }
  async createComment(
    postId: number,
    inputModel: UpdateCommentModel,
    userId: number,
  ): Promise<CommentViewModel | null> {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) return null;
    const forbiddenPosts = await this.usersBansForBlogsRepo.getBannedPostsForUser(userId);
    if (forbiddenPosts.includes(postId)) throw new ForbiddenException();
    return await this.commentsService.createComment(postId, inputModel, userId);
  }

  async likePost(postId: number, likeStatus: string, userId: number): Promise<boolean> {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) return false;
    const user = await this.usersRepository.findUserById(userId);
    const like = await this.postsLikesRepository.findOneBy({
      postId: postId,
      userId: userId,
    });
    if (!like) {
      const createdAt = new Date().toISOString();
      const newLike = await this.postsLikesRepository.create();
      newLike.postId = postId;
      newLike.login = user.login;
      newLike.likeStatus = likeStatus;
      newLike.userId = userId;
      newLike.createdAt = createdAt;
      await this.postsLikesRepository.save(newLike);
      return true;
    }
    like.likeStatus = likeStatus;
    await this.postsLikesRepository.save(like);
    return true;
  }
}
