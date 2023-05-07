import { User } from '../../users/domain/user.entity';
export declare class Device {
    id: number;
    lastActiveDate: string;
    title: string;
    deviceId: string;
    ip: string;
    userId: number;
    user: User;
}
