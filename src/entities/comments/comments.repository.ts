import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Comment } from './domain/comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Comment)
    private readonly commentsTypeOrmRepository: Repository<Comment>,
  ) {}

  async findComment(commentId: number) {
    return await this.commentsTypeOrmRepository.findOneBy({ id: commentId });
  }
}
