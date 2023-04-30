import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../users/domain/user.entity';

@Entity()
export class SaUserBan {
  @Column()
  isBanned: boolean;
  @Column()
  banReason: string;
  @Column()
  login: string;
  @Column('text', { array: true })
  bannedBlogsIds: string[];
  @Column('text', { array: true })
  bannedPostsIds: string[];
  @Column('text', { array: true })
  bannedCommentsIds: string[];
  @PrimaryColumn()
  userId: number;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
