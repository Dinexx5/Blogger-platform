import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessJwtStrategy } from './strategies/access.jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../admin/users/users.module';
import { AuthService } from './auth-service';
import { EmailAdapter } from '../../adapters/email.adapter';
import { RefreshJwtStrategy } from './strategies/refresh.jwt.strategy';
import { DevicesModule } from '../public/devices/devices.module';
import { AuthController } from './auth.controller';
import { AttemptsModule } from '../attempts/attempts.module';
import { TokensModule } from '../tokens/token.module';
import { BansRepository } from '../bans/bans.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../admin/users/domain/user.entity';
import { EmailConfirmationInfo } from '../admin/users/domain/email-confirmation.entity';
import { PasswordRecoveryInfo } from '../admin/users/domain/password-recovery.entity';
import { UserBanInfo } from '../admin/users/domain/ban-info.entity';
import { Token } from '../tokens/domain/token.entity';
import { Device } from '../public/devices/domain/device.entity';
import { SaUserBan } from '../bans/domain/saUserBan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      EmailConfirmationInfo,
      PasswordRecoveryInfo,
      UserBanInfo,
      Token,
      Device,
      SaUserBan,
    ]),
    UsersModule,
    PassportModule,
    DevicesModule,
    AttemptsModule,
    TokensModule,
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    AccessJwtStrategy,
    RefreshJwtStrategy,
    EmailAdapter,
    BansRepository,
  ],
  controllers: [AuthController],
  exports: [AuthService, EmailAdapter],
})
export class AuthModule {}
