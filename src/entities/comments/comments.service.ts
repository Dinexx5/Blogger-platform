import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { UsersRepository } from '../users/users.repository';
import { CommentsLikesRepository } from '../likes/comments.likes.repository';
import { CommentViewModel, CreateCommentModel } from './comments.models';
import { PostsRepository } from '../posts/posts.repository';

@Injectable()
export class CommentsService {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected postsRepository: PostsRepository,
    protected usersRepository: UsersRepository,
    protected commentsLikesRepository: CommentsLikesRepository,
  ) {}
  async createComment(
    postId: string,
    inputModel: CreateCommentModel,
    userId: string,
  ): Promise<CommentViewModel> {
    const user = await this.usersRepository.findUserById(userId);
    const post = await this.postsRepository.findPostInstance(postId);
    const createdAt = new Date().toISOString();
    const createdComment = await this.commentsRepository.createComment(
      inputModel.content,
      createdAt,
      user.id.toString(),
      user.login,
      post.id.toString(),
      post.title,
      post.blogId.toString(),
      post.blogName,
    );
    return {
      id: createdComment.id.toString(),
      content: createdComment.content,
      commentatorInfo: {
        userId: userId,
        userLogin: user.login,
      },
      createdAt: createdComment.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    };
  }
  async updateCommentById(commentId: string, inputModel: CreateCommentModel, userId: string) {
    const comment = await this.commentsRepository.findComment(commentId);
    if (!comment) throw new NotFoundException();
    const commentatorInfo = await this.commentsRepository.findCommentatorInfo(commentId);
    if (commentatorInfo.userId.toString() !== userId) throw new ForbiddenException();
    await this.commentsRepository.updateComment(commentId, inputModel.content);
  }

  async deleteCommentById(commentId: string, userId: string) {
    const commentInstance = await this.commentsRepository.findComment(commentId);
    if (!commentInstance) throw new NotFoundException();
    const commentatorInfo = await this.commentsRepository.findCommentatorInfo(commentId);
    if (commentatorInfo.userId.toString() !== userId) throw new ForbiddenException();
    await this.commentsRepository.deleteComment(commentId);
  }

  async likeComment(commentId: string, likeStatus: string, userId: string): Promise<boolean> {
    const comment = await this.commentsRepository.findComment(commentId);
    if (!comment) return false;
    const like = await this.commentsLikesRepository.findLikeByCommentIdAndUserId(commentId, userId);
    if (!like) {
      const createdAt = new Date().toISOString();
      await this.commentsLikesRepository.likeComment(commentId, likeStatus, userId, createdAt);
      return true;
    }
    await this.commentsLikesRepository.updateLikeStatus(commentId, userId, likeStatus);
    return true;
  }
}
