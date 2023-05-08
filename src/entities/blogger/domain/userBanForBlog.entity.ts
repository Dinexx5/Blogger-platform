import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Blog } from '../../blogs/domain/blog.entity';
import { User } from '../../users/domain/user.entity';

@Entity()
export class UserBanForBlog {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  login: string;
  @Column()
  isBanned: boolean;
  @Column()
  banReason: string;
  @Column()
  banDate: string;
  @Column('int', { array: true })
  bannedPostsIds: number[];
  @Column()
  blogId: number;
  @Column()
  userId: number;
  @OneToOne(() => Blog)
  @JoinColumn()
  blog: Blog;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
