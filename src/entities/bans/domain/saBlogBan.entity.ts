import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Blog } from '../../blogs/domain/blog.entity';

@Entity()
export class SaBlogBan {
  @Column()
  isBanned: boolean;
  @Column('text', { array: true })
  bannedPostsIds: number[];
  @PrimaryColumn()
  blogId: number;
  @OneToOne(() => Blog)
  @JoinColumn()
  blog: Blog;
}
