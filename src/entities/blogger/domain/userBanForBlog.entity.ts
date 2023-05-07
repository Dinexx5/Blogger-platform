import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Blog } from '../../blogs/domain/blog.entity';
import { User } from '../../users/domain/user.entity';

@Entity()
export class UserBanForBlog {
  @Column()
  login: string;
  @Column()
  isBanned: boolean;
  @Column()
  banReason: string;
  @Column()
  banDate: string;
  @Column('text', { array: true })
  bannedPostsIds: number[];
  @Column()
  blogId: number;
  @PrimaryColumn()
  userId: number;
  @OneToOne(() => Blog)
  @JoinColumn()
  blog: Blog;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
