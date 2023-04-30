import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Blog } from '../../blogs/domain/blog.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  shortDescription: string;
  @Column()
  content: string;
  @Column()
  blogId: number;
  @Column()
  blogName: string;
  @Column()
  createdAt: string;
  @ManyToOne(() => Blog)
  @JoinColumn()
  blog: Blog;
}
