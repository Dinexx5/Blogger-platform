import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class PasswordRecoveryInfo {
  @Column({ nullable: true })
  recoveryCode: string;
  @Column({ nullable: true })
  expirationDate: Date;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
  @PrimaryColumn()
  userId: number;
}
