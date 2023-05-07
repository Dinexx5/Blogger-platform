import { User } from '../../users/domain/user.entity';
export declare class SaUserBan {
    isBanned: boolean;
    banReason: string;
    login: string;
    bannedBlogsIds: string[];
    bannedPostsIds: string[];
    bannedCommentsIds: string[];
    userId: number;
    user: User;
}
