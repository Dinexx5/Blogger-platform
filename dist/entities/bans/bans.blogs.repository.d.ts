import { Repository } from 'typeorm';
import { SaBlogBan } from './domain/saBlogBan.entity';
export declare class BlogBansRepository {
    private readonly banTypeOrmRepository;
    constructor(banTypeOrmRepository: Repository<SaBlogBan>);
    countBannedBlogs(): Promise<number>;
    getBannedBlogs(): Promise<any[]>;
    getBannedPosts(): Promise<any[]>;
}
