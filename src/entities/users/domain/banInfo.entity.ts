import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserBanInfo {
  @Column()
  isBanned: boolean;
  @Column()
  banDate: string;
  @Column()
  banReason: string;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
  @PrimaryColumn()
  userId: number;
}
