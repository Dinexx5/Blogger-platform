import { Repository } from 'typeorm';
import { SaUserBan } from './domain/saUserBan.entity';
export declare class BansRepository {
    private readonly banTypeOrmRepository;
    constructor(banTypeOrmRepository: Repository<SaUserBan>);
    isUserBanned(userId: number): Promise<boolean>;
    countBannedUsers(): Promise<number>;
    getBannedUsers(): Promise<any[]>;
    getBannedBlogs(): Promise<any[]>;
    getBannedPosts(): Promise<any[]>;
    getBannedComments(): Promise<any[]>;
}
