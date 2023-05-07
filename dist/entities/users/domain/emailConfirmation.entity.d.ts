import { User } from './user.entity';
export declare class EmailConfirmationInfo {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
    user: User;
    userId: number;
}
