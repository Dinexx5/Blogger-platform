import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Comment } from './domain/comment.entity';
import { CommentatorInfo } from './domain/commentatorInfo.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsTypeOrmRepository: Repository<Comment>,
    @InjectRepository(CommentatorInfo)
    private readonly commentatorInfoTypeOrmRepository: Repository<CommentatorInfo>,
  ) {}

  async findComment(commentId: number) {
    return await this.commentsTypeOrmRepository.findOneBy({ id: commentId });
  }
  async findBannedComments(userId: number) {
    const commentatorsInfo = await this.commentatorInfoTypeOrmRepository.findBy({ userId: userId });
    return commentatorsInfo.map((comments) => comments.commentId);
  }
}
