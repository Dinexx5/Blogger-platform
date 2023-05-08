import { EmailConfirmationInfo } from './emailConfirmation.entity';
import { PasswordRecoveryInfo } from './passwordRecovery.entity';
import { UserBanInfo } from './banInfo.entity';
export declare class User {
    id: number;
    login: string;
    email: string;
    passwordHash: string;
    createdAt: string;
    emailConfirmationInfo: EmailConfirmationInfo;
    passwordRecoveryInfo: PasswordRecoveryInfo;
    banInfo: UserBanInfo;
}
