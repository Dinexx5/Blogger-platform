import { Repository } from 'typeorm';
import { UserBanForBlog } from '../blogger/domain/userBanForBlog.entity';
export declare class UsersBansForBlogRepository {
    private readonly usersBansForBlogsRepository;
    constructor(usersBansForBlogsRepository: Repository<UserBanForBlog>);
    countBannedUsers(): Promise<number>;
    getBannedPostsForUser(userId: number): Promise<any[]>;
}
