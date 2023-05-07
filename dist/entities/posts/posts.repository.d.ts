import { DataSource, Repository } from 'typeorm';
import { Post } from './domain/post.entity';
export declare class PostsRepository {
    protected dataSource: DataSource;
    private readonly postsTypeOrmRepository;
    constructor(dataSource: DataSource, postsTypeOrmRepository: Repository<Post>);
    findPostInstance(postId: number): Promise<Post>;
    findPostsForUser(blogs: number[]): Promise<number[]>;
}
