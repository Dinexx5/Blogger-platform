import { User } from './user.entity';
export declare class UserBanInfo {
    isBanned: boolean;
    banDate: string;
    banReason: string;
    user: User;
    userId: number;
}
