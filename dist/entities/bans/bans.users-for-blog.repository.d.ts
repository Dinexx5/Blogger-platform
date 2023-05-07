import { DataSource, Repository } from 'typeorm';
import { UserBanForBlog } from '../blogger/domain/userBanForBlog.entity';
export declare class UsersBansForBlogRepository {
    protected dataSource: DataSource;
    private readonly usersBansForBlogsRepository;
    constructor(dataSource: DataSource, usersBansForBlogsRepository: Repository<UserBanForBlog>);
    countBannedUsers(): Promise<number>;
    getBannedPostsForUser(userId: number): Promise<any[]>;
}
