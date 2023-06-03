import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersSAController } from './sa.users.controller';
import { IsLoginExistsDecorator } from '../../../shared/decorators/validation/login-exists.decorator';
import { IsEmailExistsDecorator } from '../../../shared/decorators/validation/email-exists.decorator';
import { IsConfirmationCodeCorrect } from '../../../shared/decorators/validation/confirm-email.decorator';
import { EmailResendingDecorator } from '../../../shared/decorators/validation/email-resending.decorator';
import { IsRecoveryCodeCorrect } from '../../../shared/decorators/validation/password-recovery.decorator';
import { IsUserExistsDecorator } from '../../../shared/decorators/validation/user-exists.decorator';
import { SaUsersQueryRepository } from './sa.users.query-repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { EmailConfirmationInfo } from './domain/email-confirmation.entity';
import { PasswordRecoveryInfo } from './domain/password-recovery.entity';
import { UserBanInfo } from './domain/ban-info.entity';
import { GamesStats } from '../../public/pair-game/domain/stats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      EmailConfirmationInfo,
      PasswordRecoveryInfo,
      UserBanInfo,
      GamesStats,
    ]),
  ],
  providers: [
    UsersService,
    UsersRepository,
    SaUsersQueryRepository,
    IsLoginExistsDecorator,
    IsEmailExistsDecorator,
    IsConfirmationCodeCorrect,
    EmailResendingDecorator,
    IsRecoveryCodeCorrect,
    IsUserExistsDecorator,
  ],
  controllers: [UsersSAController],
  exports: [UsersService, UsersRepository, SaUsersQueryRepository],
})
export class UsersModule {}
