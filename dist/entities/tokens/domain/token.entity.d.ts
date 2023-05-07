import { User } from '../../users/domain/user.entity';
export declare class Token {
    id: number;
    issuedAt: string;
    expiredAt: string;
    deviceId: string;
    deviceName: string;
    ip: string;
    userId: number;
    user: User;
}
