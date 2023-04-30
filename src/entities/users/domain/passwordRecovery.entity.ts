import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class PasswordRecoveryInfo {
  @Column()
  recoveryCode: string;
  @Column()
  expirationDate: string;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
  @PrimaryColumn()
  userId: number;
}
