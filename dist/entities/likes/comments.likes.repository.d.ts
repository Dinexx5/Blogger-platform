import { BansRepository } from '../bans/bans.repository';
import { DataSource } from 'typeorm';
export declare class CommentsLikesRepository {
    protected bansRepository: BansRepository;
    protected dataSource: DataSource;
    constructor(bansRepository: BansRepository, dataSource: DataSource);
    findLikesForComment(commentId: string): Promise<any>;
}
