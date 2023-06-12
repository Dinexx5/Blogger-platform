import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BlogEntity } from '../../../blogger/domain/blog.entity';
import { PostLike } from '../../../likes/domain/post-like.entity';

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
  @ManyToOne(() => BlogEntity)
  @JoinColumn()
  blog: BlogEntity;
  @OneToMany(() => PostLike, (l) => l.post)
  likes: PostLike[];
}
