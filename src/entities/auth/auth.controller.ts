import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
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
  UserTokenMetaModel,
} from '../users/user.models';
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
    const deviceName = req.headers['user-agent'] || '1';
    const accessToken = await this.authService.createJwtAccessToken(userId);
    const refreshToken = await this.authService.generateJwtRefreshToken(userId, deviceName, req.ip);
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
  async getRefreshToken(@CurrentUser() userTokenMetaDto: UserTokenMetaModel, @Res() res: Response) {
    const newAccessToken = await this.authService.createJwtAccessToken(userTokenMetaDto.userId);
    const newRefreshToken = await this.authService.updateJwtRefreshToken(userTokenMetaDto);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({ accessToken: newAccessToken });
  }
  @UseGuards(JwtRefreshAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCurrentSession(@CurrentUser() user) {
    const refreshToken = user.refreshToken;
    await this.authService.deleteCurrentToken(refreshToken);
    await this.authService.deleteDeviceForLogout(refreshToken);
  }

  // @UseGuards(RateLimitGuard)
  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registerUser(@Body() inputModel: CreateUserModel) {
    await this.authService.createUser(inputModel);
  }

  // @UseGuards(RateLimitGuard)
  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendEmail(@Body() inputModel: ResendEmailModel) {
    await this.authService.resendEmail(inputModel.email);
  }

  // @UseGuards(RateLimitGuard)
  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(@Body() inputModel: ConfirmEmailModel) {
    await this.authService.confirmEmail(inputModel.code);
  }

  // @UseGuards(RateLimitGuard)
  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async recoverPassword(@Body() inputModel: PasswordRecoveryModel) {
    await this.authService.sendEmailForPasswordRecovery(inputModel.email);
  }

  // @UseGuards(RateLimitGuard)
  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() inputModel: NewPasswordModel) {
    await this.authService.updatePassword(inputModel);
  }
}
