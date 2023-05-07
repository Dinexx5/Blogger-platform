import { DataSource, Repository } from 'typeorm';
import { SaBlogBan } from './domain/saBlogBan.entity';
export declare class BlogBansRepository {
    protected dataSource: DataSource;
    private readonly banTypeOrmRepository;
    constructor(dataSource: DataSource, banTypeOrmRepository: Repository<SaBlogBan>);
    countBannedBlogs(): Promise<number>;
    getBannedBlogs(): Promise<any[]>;
    getBannedPosts(): Promise<any[]>;
}
