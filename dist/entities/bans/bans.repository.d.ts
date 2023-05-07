import { DataSource, Repository } from 'typeorm';
import { SaUserBan } from './domain/saUserBan.entity';
export declare class BansRepository {
    protected dataSource: DataSource;
    private readonly banTypeOrmRepository;
    constructor(dataSource: DataSource, banTypeOrmRepository: Repository<SaUserBan>);
    isUserBanned(userId: number): Promise<boolean>;
    countBannedUsers(): Promise<number>;
    getBannedUsers(): Promise<any[]>;
    getBannedBlogs(): Promise<any[]>;
    getBannedPosts(): Promise<any[]>;
    getBannedComments(): Promise<any[]>;
}
