import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/domain/user.entity';

@Entity()
export class SaUserBan {
  @Column()
  isBanned: boolean;
  @Column({ nullable: true })
  banReason: string;
  @Column()
  login: string;
  @Column('int', { array: true })
  bannedBlogsIds: number[];
  @Column('int', { array: true })
  bannedPostsIds: number[];
  @Column('int', { array: true })
  bannedCommentsIds: number[];
  @PrimaryColumn()
  userId: number;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
