import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Blog } from './blog.entity';
import { User } from '../../users/domain/user.entity';

@Entity()
export class BlogOwnerInfo {
  @Column()
  userLogin: string;
  @ManyToOne(() => Blog)
  @JoinColumn()
  blog: Blog;
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
  @PrimaryColumn()
  blogId: number;
  @Column()
  userId: number;
}
