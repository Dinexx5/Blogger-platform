import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Blog } from '../../public/blogs/domain/blog.entity';

@Entity()
export class SaBlogBan {
  @Column()
  isBanned: boolean;
  @Column('int', { array: true })
  bannedPostsIds: number[];
  @PrimaryColumn()
  blogId: number;
  @OneToOne(() => Blog)
  @JoinColumn()
  blog: Blog;
}
