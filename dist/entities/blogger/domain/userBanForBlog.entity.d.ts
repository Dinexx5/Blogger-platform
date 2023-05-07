import { Blog } from '../../blogs/domain/blog.entity';
import { User } from '../../users/domain/user.entity';
export declare class UserBanForBlog {
    login: string;
    isBanned: boolean;
    banReason: string;
    banDate: string;
    bannedPostsIds: number[];
    blogId: number;
    userId: number;
    blog: Blog;
    user: User;
}
