import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { v4 as uuidv4 } from 'uuid';
import { add, addDays } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { CreateUserModel, NewPasswordModel, SaUserViewModel, UserFromSqlRepo } from './userModels';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { Repository } from 'typeorm';
import { UserBanInfo } from './domain/banInfo.entity';
import { EmailConfirmationInfo } from './domain/emailConfirmation.entity';
import { PasswordRecoveryInfo } from './domain/passwordRecovery.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersTypeOrmRepository: Repository<User>,
    @InjectRepository(UserBanInfo)
    private readonly banInfoRepository: Repository<UserBanInfo>,
    @InjectRepository(EmailConfirmationInfo)
    private readonly emailConfirmationRepository: Repository<EmailConfirmationInfo>,
    @InjectRepository(PasswordRecoveryInfo)
    private readonly passwordRecoveryRepository: Repository<PasswordRecoveryInfo>,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createUser(inputModel: CreateUserModel): Promise<SaUserViewModel> {
    const passwordHash = await this.generateHash(inputModel.password);
    const expirationDate = addDays(new Date(), 1);
    const confirmationCode = uuidv4();
    const isConfirmed = true;
    const createdAt = new Date().toISOString();

    const user = await this.usersTypeOrmRepository.create();
    user.login = inputModel.login;
    user.email = inputModel.email;
    user.passwordHash = passwordHash;
    user.createdAt = createdAt;
    await this.usersRepository.save(user);
    const banInfo = await this.banInfoRepository.create();
    banInfo.userId = user.id;
    banInfo.isBanned = false;
    banInfo.banDate = null;
    banInfo.banReason = null;
    await this.banInfoRepository.save(banInfo);
    const emailConfirmationInfo = await this.emailConfirmationRepository.create();
    emailConfirmationInfo.userId = user.id;
    emailConfirmationInfo.confirmationCode = confirmationCode;
    emailConfirmationInfo.isConfirmed = isConfirmed;
    emailConfirmationInfo.expirationDate = expirationDate;
    await this.emailConfirmationRepository.save(emailConfirmationInfo);
    const passwordRecoveryInfo = await this.passwordRecoveryRepository.create();
    passwordRecoveryInfo.userId = user.id;
    passwordRecoveryInfo.expirationDate = null;
    passwordRecoveryInfo.recoveryCode = null;
    await this.passwordRecoveryRepository.save(passwordRecoveryInfo);

    if (!user) {
      return null;
    }
    return {
      id: user.id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
      banInfo: {
        isBanned: false,
        banDate: null,
        banReason: null,
      },
    };
  }
  async deleteUserById(userId: number): Promise<boolean> {
    const user: User = await this.usersRepository.findUserById(userId);
    if (!user) return false;
    await this.passwordRecoveryRepository.delete({ userId: userId });
    await this.emailConfirmationRepository.delete({ userId: userId });
    await this.banInfoRepository.delete({ userId: userId });
    await this.usersTypeOrmRepository.remove(user);
    return true;
  }
  async checkConfirmation(userId: number): Promise<boolean> {
    console.log(userId);
    const confirmationInfo = await this.emailConfirmationRepository.findOneBy({ userId: userId });
    console.log(confirmationInfo);
    return confirmationInfo.isConfirmed;
  }
  async generateHash(password: string) {
    const passwordSalt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, passwordSalt);
  }
  async updateConfirmationCode(confirmationCode: string) {
    const confirmationInfo = await this.emailConfirmationRepository.findOneBy({
      confirmationCode: confirmationCode,
    });
    if (!confirmationInfo) return false;
    confirmationInfo.confirmationCode = confirmationCode;
    await this.emailConfirmationRepository.save(confirmationInfo);
    return true;
  }
  async updateConfirmation(confirmationCode: string) {
    const confirmationInfo = await this.emailConfirmationRepository.findOneBy({
      confirmationCode: confirmationCode,
    });
    if (!confirmationInfo) return false;
    confirmationInfo.isConfirmed = true;
    await this.emailConfirmationRepository.save(confirmationInfo);
    return true;
  }
  async updateRecoveryCode(email: string, recoveryCode: string) {
    const user = await this.usersRepository.findUserByLoginOrEmail(email);
    if (!user) return false;
    const expirationDate = add(new Date(), { hours: 1 });
    const recoveryInfo = await this.passwordRecoveryRepository.findOneBy({
      recoveryCode: recoveryCode,
    });
    recoveryInfo.recoveryCode = recoveryCode;
    recoveryInfo.expirationDate = expirationDate;
    await this.passwordRecoveryRepository.save(recoveryInfo);
    return true;
  }
  async updatePassword(inputModel: NewPasswordModel): Promise<boolean> {
    const recoveryInfo = await this.passwordRecoveryRepository.findOneBy({
      recoveryCode: inputModel.recoveryCode,
    });
    if (!recoveryInfo) return false;
    const newPasswordHash = await this.generateHash(inputModel.newPassword);
    const user = await this.usersRepository.findUserById(recoveryInfo.userId);
    user.passwordHash = newPasswordHash;
    await this.usersRepository.save(user);
    return true;
  }
}
