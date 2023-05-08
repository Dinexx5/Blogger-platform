import { Repository } from 'typeorm';
import { Post } from './domain/post.entity';
export declare class PostsRepository {
    private readonly postsTypeOrmRepository;
    constructor(postsTypeOrmRepository: Repository<Post>);
    findPostInstance(postId: number): Promise<Post>;
    findPostsForUser(blogs: number[]): Promise<number[]>;
}
