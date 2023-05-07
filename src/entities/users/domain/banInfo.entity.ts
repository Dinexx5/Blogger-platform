import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserBanInfo {
  @Column()
  isBanned: boolean;
  @Column({ nullable: true })
  banDate: string;
  @Column({ nullable: true })
  banReason: string;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
  @PrimaryColumn()
  userId: number;
}
