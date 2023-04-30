import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { v4 as uuidv4 } from 'uuid';
import { add, addDays } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { CreateUserModel, NewPasswordModel, SaUserViewModel, UserFromSqlRepo } from './userModels';

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}

  async createUser(inputModel: CreateUserModel): Promise<SaUserViewModel> {
    const passwordHash = await this.generateHash(inputModel.password);
    const expirationDate = addDays(new Date(), 1);
    const confirmationCode = uuidv4();
    const isConfirmed = true;
    const createdAt = new Date().toISOString();

    const createdUser = await this.usersRepository.createUser(
      inputModel.login,
      inputModel.email,
      passwordHash,
      createdAt,
      expirationDate,
      confirmationCode,
      isConfirmed,
    );

    if (!createdUser) {
      return null;
    }
    return {
      id: createdUser.id.toString(),
      login: createdUser.login,
      email: createdUser.email,
      createdAt: createdUser.createdAt,
      banInfo: {
        isBanned: false,
        banDate: null,
        banReason: null,
      },
    };
  }
  async deleteUserById(userId: string): Promise<boolean> {
    const userInstance = await this.usersRepository.findUserById(userId);
    if (!userInstance) return false;
    await this.usersRepository.deleteUser(userId);
    return true;
  }
  async findUserByLoginOrEmail(login: string): Promise<UserFromSqlRepo | null> {
    const user = await this.usersRepository.findUserByLoginOrEmail(login);
    if (!user) return null;
    return user;
  }
  async checkConfirmation(userId: string): Promise<UserFromSqlRepo | null> {
    const isConfirmed = await this.usersRepository.findConfirmation(userId);
    return isConfirmed;
  }
  async generateHash(password: string) {
    const passwordSalt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, passwordSalt);
  }
  async updateCode(email: string, code: string) {
    const user = await this.usersRepository.findUserByLoginOrEmail(email);
    if (!user) return false;
    await this.usersRepository.updateConfirmationCode(user.id, code);
    return true;
  }
  async updateConfirmation(code: string) {
    const user = await this.usersRepository.findUserByConfirmationCode(code);
    if (!user) return false;
    await this.usersRepository.updateConfirmation(code);
    return true;
  }
  async updateRecoveryCode(email: string, recoveryCode: string) {
    const user = await this.usersRepository.findUserByLoginOrEmail(email);
    if (!user) return false;
    const expirationDate = add(new Date(), { hours: 1 });
    await this.usersRepository.updateRecoveryCode(user.id, recoveryCode, expirationDate);
    return true;
  }
  async updatePassword(inputModel: NewPasswordModel): Promise<boolean> {
    const user = await this.usersRepository.findUserByRecoveryCode(inputModel.recoveryCode);
    if (!user) return false;
    const newPasswordHash = await this.generateHash(inputModel.newPassword);
    await this.usersRepository.updatePassword(user.id, newPasswordHash);
    return true;
  }
}
