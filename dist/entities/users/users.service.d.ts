import { UsersRepository } from './users.repository';
import { CreateUserModel, NewPasswordModel, SaUserViewModel } from './userModels';
import { User } from './domain/user.entity';
import { Repository } from 'typeorm';
import { UserBanInfo } from './domain/banInfo.entity';
import { EmailConfirmationInfo } from './domain/emailConfirmation.entity';
import { PasswordRecoveryInfo } from './domain/passwordRecovery.entity';
export declare class UsersService {
    private readonly usersTypeOrmRepository;
    private readonly banInfoRepository;
    private readonly emailConfirmationRepository;
    private readonly passwordRecoveryRepository;
    private readonly usersRepository;
    constructor(usersTypeOrmRepository: Repository<User>, banInfoRepository: Repository<UserBanInfo>, emailConfirmationRepository: Repository<EmailConfirmationInfo>, passwordRecoveryRepository: Repository<PasswordRecoveryInfo>, usersRepository: UsersRepository);
    createUser(inputModel: CreateUserModel): Promise<SaUserViewModel>;
    deleteUserById(userId: number): Promise<boolean>;
    checkConfirmation(userId: number): Promise<boolean>;
    generateHash(password: string): Promise<string>;
    updateConfirmationCode(email: string, confirmationCode: string): Promise<boolean>;
    updateConfirmation(confirmationCode: string): Promise<boolean>;
    updateRecoveryCode(email: string, recoveryCode: string): Promise<boolean>;
    updatePassword(inputModel: NewPasswordModel): Promise<boolean>;
}
