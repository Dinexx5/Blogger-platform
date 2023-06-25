import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PostEntity } from './domain/post.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsTypeOrmRepository: Repository<PostEntity>,
  ) {}

  async findPostById(postId: number) {
    return await this.postsTypeOrmRepository.findOneBy({ id: postId });
  }
  async findPostsForUser(blogs: number[]) {
    if (blogs.length === 0) return [];
    const posts = await this.postsTypeOrmRepository.findBy({ blogId: In(blogs) });
    return posts.map((post) => post.id);
  }
}
