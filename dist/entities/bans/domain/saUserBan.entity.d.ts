import { User } from '../../users/domain/user.entity';
export declare class SaUserBan {
    isBanned: boolean;
    banReason: string;
    login: string;
    bannedBlogsIds: number[];
    bannedPostsIds: number[];
    bannedCommentsIds: number[];
    userId: number;
    user: User;
}
