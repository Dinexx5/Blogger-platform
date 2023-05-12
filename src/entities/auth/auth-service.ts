import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { DevicesService } from '../devices/devices.service';
import { v4 as uuidv4 } from 'uuid';
import { addDays } from 'date-fns';
import { EmailAdapter } from '../../adapters/email.adapter';
import { CreateUserModel, NewPasswordModel, UserTokenMetaModel } from '../users/user.models';
import * as bcrypt from 'bcrypt';
import { BansRepository } from '../bans/bans.repository';
import { Repository } from 'typeorm';
import { User } from '../users/domain/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBanInfo } from '../users/domain/banInfo.entity';
import { EmailConfirmationInfo } from '../users/domain/emailConfirmation.entity';
import { PasswordRecoveryInfo } from '../users/domain/passwordRecovery.entity';
import { UsersRepository } from '../users/users.repository';
import { Token } from '../tokens/domain/token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersTypeOrmRepository: Repository<User>,
    @InjectRepository(UserBanInfo)
    private readonly banInfoRepository: Repository<UserBanInfo>,
    @InjectRepository(EmailConfirmationInfo)
    private readonly emailConfirmationRepository: Repository<EmailConfirmationInfo>,
    @InjectRepository(PasswordRecoveryInfo)
    private readonly passwordRecoveryRepository: Repository<PasswordRecoveryInfo>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
    private readonly emailAdapter: EmailAdapter,
    private readonly usersService: UsersService,
    private readonly devicesService: DevicesService,
    private readonly bansRepository: BansRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user: User = await this.usersRepository.findUserByLoginOrEmail(username);
    if (!user) return null;
    const isConfirmed = await this.usersService.checkConfirmation(user.id);
    if (!isConfirmed) return null;
    const isBanned = await this.bansRepository.isUserBanned(user.id);
    if (isBanned) return null;
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) return null;
    return user.id;
  }

  async createJwtAccessToken(userId: number) {
    const payload = { userId: userId };
    return this.jwtService.sign(payload, {
      secret: process.env.ACCESS_SECRET,
      expiresIn: '10000s',
    });
  }
  async generateJwtRefreshToken(userId: number, deviceName: string, ip: string) {
    const deviceId = new Date().toISOString();
    const payload = { userId: userId, deviceId: deviceId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '20000s',
    });
    const result = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_SECRET,
    });
    const issuedAt = new Date(result.iat * 1000).toISOString();
    const expiredAt = new Date(result.exp * 1000).toISOString();
    const token = await this.tokenRepository.create();
    token.issuedAt = issuedAt;
    token.userId = userId;
    token.deviceId = deviceId;
    token.deviceName = deviceName;
    token.ip = ip;
    token.expiredAt = expiredAt;
    await this.tokenRepository.save(token);
    await this.devicesService.createDevice(userId, ip, deviceName, deviceId, issuedAt);
    return refreshToken;
  }

  async updateJwtRefreshToken(inputModel: UserTokenMetaModel) {
    const previousExpirationDate = new Date(inputModel.exp * 1000).toISOString();
    const newPayload = { userId: inputModel.userId, deviceId: inputModel.deviceId };
    const newRefreshToken = this.jwtService.sign(newPayload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '20000s',
    });
    const newResult: any = await this.getRefreshTokenInfo(newRefreshToken);
    const newIssuedAt = new Date(newResult.iat * 1000).toISOString();
    const newExpiredAt = new Date(newResult.exp * 1000).toISOString();
    const token = await this.tokenRepository.findOneBy({ expiredAt: previousExpirationDate });
    token.issuedAt = newIssuedAt;
    token.expiredAt = newExpiredAt;
    await this.tokenRepository.save(token);
    await this.devicesService.updateLastActiveDate(inputModel.deviceId, newIssuedAt);
    return newRefreshToken;
  }
  async getRefreshTokenInfo(token: string) {
    try {
      return this.jwtService.verify(token, { secret: process.env.REFRESH_SECRET });
    } catch (error) {
      return null;
    }
  }
  async getAccessTokenInfo(token: string) {
    try {
      return this.jwtService.verify(token, { secret: process.env.ACCESS_SECRET });
    } catch (error) {
      return null;
    }
  }
  async deleteCurrentToken(token: string) {
    const result: any = await this.getRefreshTokenInfo(token);
    if (!result) throw new UnauthorizedException();
    const expirationDate = new Date(result.exp * 1000).toISOString();
    const foundToken: Token = await this.tokenRepository.findOneBy({
      expiredAt: expirationDate,
    });
    if (!foundToken) throw new UnauthorizedException();
    await this.tokenRepository.remove(foundToken);
  }
  async deleteDeviceForLogout(token: string) {
    const result: any = await this.getRefreshTokenInfo(token);
    const deviceId = result.deviceId;
    await this.devicesService.deleteDevice(deviceId);
  }
  async createUser(inputModel: CreateUserModel) {
    const passwordHash = await this.usersService.generateHash(inputModel.password);
    const expirationDate = addDays(new Date(), 1);
    const confirmationCode = uuidv4();
    const isConfirmed = false;
    const createdAt = new Date().toISOString();

    const user = await this.usersTypeOrmRepository.create();
    user.login = inputModel.login;
    user.email = inputModel.email;
    user.passwordHash = passwordHash;
    user.createdAt = createdAt;
    await this.usersTypeOrmRepository.save(user);

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

    try {
      await this.emailAdapter.sendEmailForConfirmation(inputModel.email, confirmationCode);
    } catch (error) {
      console.log('Something wrong with sending an email');
      console.error(error);
      return;
    }
    return user;
  }

  async resendEmail(email: string) {
    const confirmationCode = uuidv4();
    try {
      await this.emailAdapter.sendEmailForConfirmation(email, confirmationCode);
    } catch (error) {
      console.log('Something wrong with sending an email');
      console.error(error);
      return;
    }
    await this.usersService.updateConfirmationCode(email, confirmationCode);
  }
  async confirmEmail(code: string) {
    const isConfirmed = await this.usersService.updateConfirmation(code);
    if (!isConfirmed) throw new BadRequestException();
  }

  async sendEmailForPasswordRecovery(email: string) {
    const confirmationCode = uuidv4();
    await this.usersService.updateRecoveryCode(confirmationCode);
    try {
      await this.emailAdapter.sendEmailForPasswordRecovery(email, confirmationCode);
    } catch (error) {
      console.log('Something went wrong with sending an email');
      console.error(error);
      return;
    }
  }
  async updatePassword(inputModel: NewPasswordModel) {
    await this.usersService.updatePassword(inputModel);
  }
}
