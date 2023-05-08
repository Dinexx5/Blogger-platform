import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EmailConfirmationInfo } from './emailConfirmation.entity';
import { PasswordRecoveryInfo } from './passwordRecovery.entity';
import { UserBanInfo } from './banInfo.entity';

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
}
