import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { UsersRepository } from '../../admin/users/users.repository';
import { CommentViewModel, CreateCommentModel, UpdateCommentModel } from './comments.models';
import { PostsRepository } from '../posts/posts.repository';
import { User } from '../../admin/users/domain/user.entity';
import { Post } from '../posts/domain/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './domain/comment.entity';
import { CommentatorInfo } from './domain/commentatorInfo.entity';
import { PostInfoForComment } from './domain/postInfo.entity';
import { CommentLike } from '../../likes/domain/comment-like.entity';

@Injectable()
export class CommentsService {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected postsRepository: PostsRepository,
    protected usersRepository: UsersRepository,
    @InjectRepository(Comment)
    private readonly commentsTypeOrmRepository: Repository<Comment>,
    @InjectRepository(CommentatorInfo)
    private readonly commentatorInfoRepository: Repository<CommentatorInfo>,
    @InjectRepository(PostInfoForComment)
    private readonly postInfoRepository: Repository<PostInfoForComment>,
    @InjectRepository(CommentLike)
    private readonly commentsLikesRepository: Repository<CommentLike>,
  ) {}
  async createComment(
    postId: number,
    inputModel: CreateCommentModel,
    userId: number,
  ): Promise<CommentViewModel> {
    const user: User = await this.usersRepository.findUserById(userId);
    const post: Post = await this.postsRepository.findPostInstance(postId);
    const createdAt = new Date().toISOString();
    const comment = await this.commentsTypeOrmRepository.create();
    comment.content = inputModel.content;
    comment.createdAt = createdAt;
    await this.commentsTypeOrmRepository.save(comment);
    const commentatorInfo = await this.commentatorInfoRepository.create();
    commentatorInfo.commentId = comment.id;
    commentatorInfo.userId = user.id;
    commentatorInfo.userLogin = user.login;
    await this.commentatorInfoRepository.save(commentatorInfo);
    const postInfo = await this.postInfoRepository.create();
    postInfo.commentId = comment.id;
    postInfo.postId = post.id;
    postInfo.title = post.title;
    postInfo.blogId = post.blogId;
    postInfo.blogName = post.blogName;
    await this.postInfoRepository.save(postInfo);

    return {
      id: comment.id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: userId.toString(),
        userLogin: user.login,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    };
  }
  async updateCommentById(commentId: number, inputModel: UpdateCommentModel, userId: number) {
    const comment: Comment = await this.commentsRepository.findComment(commentId);
    if (!comment) throw new NotFoundException();
    const commentatorInfo = await this.commentatorInfoRepository.findOneBy({
      commentId: commentId,
    });
    if (commentatorInfo.userId !== userId) throw new ForbiddenException();
    comment.content = inputModel.content;
    await this.commentsTypeOrmRepository.save(comment);
  }

  async deleteCommentById(commentId: number, userId: number) {
    const comment: Comment = await this.commentsRepository.findComment(commentId);
    if (!comment) throw new NotFoundException();
    const commentatorInfo = await this.commentatorInfoRepository.findOneBy({
      commentId: commentId,
    });
    if (commentatorInfo.userId !== userId) throw new ForbiddenException();
    await this.commentatorInfoRepository.remove(commentatorInfo);
    await this.postInfoRepository.delete({ commentId: commentId });
    await this.commentsTypeOrmRepository.remove(comment);
  }

  async likeComment(commentId: number, likeStatus: string, userId: number): Promise<boolean> {
    const comment = await this.commentsRepository.findComment(commentId);
    if (!comment) return false;
    const like = await this.commentsLikesRepository.findOneBy({
      commentId: commentId,
      userId: userId,
    });
    if (!like) {
      const createdAt = new Date().toISOString();
      const newLike = await this.commentsLikesRepository.create();
      newLike.commentId = commentId;
      newLike.likeStatus = likeStatus;
      newLike.userId = userId;
      newLike.createdAt = createdAt;
      await this.commentsLikesRepository.save(newLike);
      return true;
    }
    like.likeStatus = likeStatus;
    await this.commentsLikesRepository.save(like);
    return true;
  }
}
