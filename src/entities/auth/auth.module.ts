import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessJwtStrategy } from './strategies/access.jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth-service';
import { EmailAdapter } from '../../adapters/email.adapter';
import { RefreshJwtStrategy } from './strategies/refresh.jwt.strategy';
import { DevicesModule } from '../devices/devices.module';
import { AuthController } from './auth.controller';
import { AttemptsModule } from '../attempts/attempts.module';
import { TokensModule } from '../tokens/token.module';
import { BansRepository } from '../bans/bans.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/domain/user.entity';
import { EmailConfirmationInfo } from '../users/domain/emailConfirmation.entity';
import { PasswordRecoveryInfo } from '../users/domain/passwordRecovery.entity';
import { UserBanInfo } from '../users/domain/banInfo.entity';
import { Token } from '../tokens/domain/token.entity';
import { Device } from '../devices/domain/device.entity';
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
