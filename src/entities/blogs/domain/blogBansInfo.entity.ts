import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from './blog.entity';

@Entity()
export class BlogBansInfo {
  @Column()
  isBanned: boolean;
  @Column({ nullable: true })
  banDate: string;
  @ManyToOne(() => Blog)
  @JoinColumn()
  blog: Blog;
  @PrimaryColumn()
  blogId: number;
}
