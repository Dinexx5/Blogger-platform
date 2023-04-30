import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Blog } from './blog.entity';
import { User } from '../../users/domain/user.entity';

@Entity()
export class BlogOwnerInfo {
  @Column()
  userLogin: string;
  @OneToOne(() => Blog)
  @JoinColumn()
  blog: Blog;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
  @PrimaryColumn()
  blogId: number;
  @Column()
  userId: number;
}
