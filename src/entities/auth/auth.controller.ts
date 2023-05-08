import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth-service';
import { JwtAccessAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { UsersRepository } from '../users/users.repository';
import {
  ConfirmEmailModel,
  CreateUserModel,
  NewPasswordModel,
  PasswordRecoveryModel,
  ResendEmailModel,
} from '../users/userModels';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../users/domain/user.entity';
import { RateLimitGuard } from './guards/rate-limit.guard';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    protected usersRepository: UsersRepository,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @CurrentUser() userId: number, @Res() res: Response) {
    const ip = req.ip;
    const deviceName = req.headers['user-agent'] || '1';
    const accessToken = await this.authService.createJwtAccessToken(userId);
    const refreshToken = await this.authService.generateJwtRefreshToken(userId, deviceName, ip);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({ accessToken: accessToken });
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() userId: number, @Res() res: Response) {
    const user: User = await this.usersRepository.findUserById(userId);
    res.send({
      email: user.email,
      login: user.login,
      userId: userId.toString(),
    });
  }
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-token')
  async getRefreshToken(@CurrentUser() userTokenMeta, @Res() res: Response) {
    const { deviceId, exp } = userTokenMeta;
    const userId = userTokenMeta.userId;
    const newAccessToken = await this.authService.createJwtAccessToken(userId);
    const newRefreshToken = await this.authService.updateJwtRefreshToken(deviceId, exp, userId);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({ accessToken: newAccessToken });
  }
  @UseGuards(JwtRefreshAuthGuard)
  @Post('logout')
  async deleteCurrentSession(@CurrentUser() user, @Res() res: Response) {
    const refreshToken = user.refreshToken;
    await this.authService.deleteCurrentToken(refreshToken);
    await this.authService.deleteDeviceForLogout(refreshToken);
    return res.sendStatus(204);
  }

  // @UseGuards(RateLimitGuard)
  @Post('registration')
  async registerUser(@Body() inputModel: CreateUserModel, @Res() res: Response) {
    const createdAccount = await this.authService.createUser(inputModel);
    if (!createdAccount) return res.send('can not send email. try later');
    return res.sendStatus(204);
  }

  // @UseGuards(RateLimitGuard)
  @Post('registration-email-resending')
  async resendEmail(@Body() inputModel: ResendEmailModel, @Res() res: Response) {
    const isEmailResent = await this.authService.resendEmail(inputModel.email);
    if (!isEmailResent) return res.send('Can not send an email');
    return res.sendStatus(204);
  }

  // @UseGuards(RateLimitGuard)
  @Post('registration-confirmation')
  async confirmEmail(@Body() inputModel: ConfirmEmailModel, @Res() res: Response) {
    const isConfirmed = await this.authService.confirmEmail(inputModel.code);
    if (!isConfirmed) return res.sendStatus(400);
    return res.sendStatus(204);
  }

  // @UseGuards(RateLimitGuard)
  @Post('password-recovery')
  async recoverPassword(@Body() inputModel: PasswordRecoveryModel, @Res() res: Response) {
    const isEmailSent = await this.authService.sendEmailForPasswordRecovery(inputModel.email);
    if (!isEmailSent) return res.status(204).send('something went wrong');
    return res.sendStatus(204);
  }

  // @UseGuards(RateLimitGuard)
  @Post('new-password')
  async newPassword(@Body() inputModel: NewPasswordModel, @Res() res: Response) {
    const isPasswordUpdated = await this.authService.updatePassword(inputModel);
    if (!isPasswordUpdated) return res.send('something went wrong');
    return res.sendStatus(204);
  }
}
