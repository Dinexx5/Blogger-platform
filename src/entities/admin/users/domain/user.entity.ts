import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EmailConfirmationInfo } from './email-confirmation.entity';
import { PasswordRecoveryInfo } from './password-recovery.entity';
import { UserBanInfo } from './ban-info.entity';
import { GamesStats } from '../../../public/pair-game/domain/stats.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  login: string;
  @Column()
  email: string;
  @Column()
  passwordHash: string;
  @Column()
  createdAt: string;
  @OneToOne(() => EmailConfirmationInfo, (eci) => eci.user)
  emailConfirmationInfo: EmailConfirmationInfo;
  @OneToOne(() => PasswordRecoveryInfo, (pri) => pri.user)
  passwordRecoveryInfo: PasswordRecoveryInfo;
  @OneToOne(() => UserBanInfo, (bi) => bi.user)
  banInfo: UserBanInfo;
  @OneToOne(() => GamesStats, (gs) => gs.user)
  gamesStats: GamesStats;
}
