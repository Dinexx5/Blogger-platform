import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Post } from './domain/post.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Post)
    private readonly postsTypeOrmRepository: Repository<Post>,
  ) {}

  async findPostInstance(postId: number) {
    return await this.postsTypeOrmRepository.findOneBy({ id: postId });
  }
  async findPostsForUser(blogs: number[]) {
    if (blogs.length === 0) return [];
    const posts = await this.postsTypeOrmRepository.findBy({ blogId: In(blogs) });
    return posts.map((post) => post.id);
  }
}
