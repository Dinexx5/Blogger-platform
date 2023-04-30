import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Blog } from './blog.entity';

@Entity()
export class BlogBansInfo {
  @Column()
  isBanned: boolean;
  @Column()
  banDate: string;
  @OneToOne(() => Blog)
  @JoinColumn()
  blog: Blog;
  @PrimaryColumn()
  blogId: number;
}
