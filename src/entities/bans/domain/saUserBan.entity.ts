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
  @Column('text', { array: true })
  bannedBlogsIds: string[];
  @Column('text', { array: true })
  bannedPostsIds: string[];
  @Column('text', { array: true })
  bannedCommentsIds: string[];
  @PrimaryGeneratedColumn()
  userId: number;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
