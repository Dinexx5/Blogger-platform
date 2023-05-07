import { BansRepository } from '../bans/bans.repository';
import { DataSource } from 'typeorm';
export declare class PostsLikesRepository {
    protected bansRepository: BansRepository;
    protected dataSource: DataSource;
    constructor(bansRepository: BansRepository, dataSource: DataSource);
    findLikesForPost(postId: string): Promise<any>;
    findThreeLatestLikes(postId: string): Promise<any>;
}
