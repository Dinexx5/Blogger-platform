import { User } from './user.entity';
export declare class PasswordRecoveryInfo {
    recoveryCode: string;
    expirationDate: Date;
    user: User;
    userId: number;
}
