import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { TokenRepository } from '../tokens/token.repository';
import { DevicesService } from '../devices/devices.service';
import { v4 as uuidv4 } from 'uuid';
import { add, addDays } from 'date-fns';
import { EmailAdapter } from '../../adapters/email.adapter';
import { DevicesRepository } from '../devices/devices.repository';
import { CreateUserModel, NewPasswordModel } from '../users/userModels';
import * as bcrypt from 'bcrypt';
import { BansRepository } from '../bans/bans.repository';
import { tokenSqlModel } from '../tokens/tokens.models';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly emailAdapter: EmailAdapter,
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    protected tokenRepository: TokenRepository,
    protected devicesService: DevicesService,
    protected devicesRepository: DevicesRepository,
    protected bansRepository: BansRepository,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByLoginOrEmail(username);
    if (!user) return null;
    const isConfirmed = await this.usersService.checkConfirmation(user.id.toString());
    if (!isConfirmed) return null;
    const isBanned = await this.bansRepository.findBanByUserId(user.id.toString());
    if (isBanned) return null;
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) return null;
    return user.id.toString();
  }

  async createJwtAccessToken(userId: string) {
    const payload = { userId: userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_SECRET,
      expiresIn: '10000s',
    });
    return accessToken;
  }
  async createJwtRefreshToken(userId: string, deviceName: string, ip: string) {
    const deviceId = new Date().toISOString();
    const payload = { userId: userId.toString(), deviceId: deviceId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '20000s',
    });
    const result = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_SECRET,
    });
    const issuedAt = new Date(result.iat * 1000).toISOString();
    const expiredAt = new Date(result.exp * 1000).toISOString();
    const tokenMetaDTO = {
      issuedAt: issuedAt,
      userId: userId,
      deviceId: deviceId,
      deviceName: deviceName,
      ip: ip,
      expiredAt: expiredAt,
    };
    await this.tokenRepository.createToken(tokenMetaDTO);
    await this.devicesService.createDevice(userId, ip, deviceName, deviceId, issuedAt);
    return refreshToken;
  }
  async updateJwtRefreshToken(deviceId: string, exp: number, userId: string) {
    const previousExpirationDate = new Date(exp * 1000).toISOString();
    const newPayload = { userId: userId, deviceId: deviceId };
    const newRefreshToken = this.jwtService.sign(newPayload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '20000s',
    });
    const newResult: any = await this.getRefreshTokenInfo(newRefreshToken);
    const newIssuedAt = new Date(newResult.iat * 1000).toISOString();
    const newExpiredAt = new Date(newResult.exp * 1000).toISOString();
    await this.tokenRepository.updateToken(previousExpirationDate, newExpiredAt, newIssuedAt);
    await this.devicesRepository.updateLastActiveDate(deviceId, newIssuedAt);
    return newRefreshToken;
  }
  async getRefreshTokenInfo(token: string) {
    try {
      const result: any = this.jwtService.verify(token, { secret: process.env.REFRESH_SECRET });
      return result;
    } catch (error) {
      return null;
    }
  }
  async getAccessTokenInfo(token: string) {
    try {
      const result: any = this.jwtService.verify(token, { secret: process.env.ACCESS_SECRET });
      return result;
    } catch (error) {
      return null;
    }
  }
  async deleteCurrentToken(token: string) {
    const result: any = await this.getRefreshTokenInfo(token);
    if (!result) throw new UnauthorizedException();
    const expirationDate = new Date(result.exp * 1000).toISOString();
    const foundToken: tokenSqlModel = await this.tokenRepository.findToken(expirationDate);
    if (!foundToken) throw new UnauthorizedException();
    await this.tokenRepository.deleteToken(expirationDate);
  }
  async deleteDeviceForLogout(token: string) {
    const result: any = await this.getRefreshTokenInfo(token);
    const deviceId = result.deviceId;
    await this.devicesRepository.deleteDevice(deviceId);
  }
  async createUser(inputModel: CreateUserModel) {
    const passwordHash = await this.usersService.generateHash(inputModel.password);
    const expirationDate = addDays(new Date(), 1);
    const confirmationCode = uuidv4();
    const isConfirmed = false;
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
    try {
      await this.emailAdapter.sendEmailForConfirmation(inputModel.email, confirmationCode);
    } catch (error) {
      return null;
    }
    return createdUser;
  }
  async resendEmail(email: string): Promise<boolean> {
    const confirmationCode = uuidv4();
    try {
      await this.emailAdapter.sendEmailForConfirmation(email, confirmationCode);
    } catch (error) {
      console.error(error);
      return false;
    }
    const isUpdated = await this.usersService.updateCode(email, confirmationCode);
    if (!isUpdated) return false;
    return true;
  }
  async confirmEmail(code: string): Promise<boolean> {
    const isConfirmed = await this.usersService.updateConfirmation(code);
    if (!isConfirmed) return false;
    return true;
  }
  async sendEmailForPasswordRecovery(email: string): Promise<boolean> {
    const confirmationCode = uuidv4();
    const isUpdated = await this.usersService.updateRecoveryCode(email, confirmationCode);
    if (!isUpdated) return false;
    try {
      await this.emailAdapter.sendEmailForPasswordRecovery(email, confirmationCode);
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  }
  async updatePassword(inputModel: NewPasswordModel): Promise<boolean> {
    const isUpdated = await this.usersService.updatePassword(inputModel);
    if (!isUpdated) return false;
    return true;
  }
}
