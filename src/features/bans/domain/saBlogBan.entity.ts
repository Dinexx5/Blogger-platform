import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { BlogEntity } from '../../blogger/domain/blog.entity';

@Entity()
export class SaBlogBan {
  @Column()
  isBanned: boolean;
  @Column('int', { array: true })
  bannedPostsIds: number[];
  @PrimaryColumn()
  blogId: number;
  @OneToOne(() => BlogEntity)
  @JoinColumn()
  blog: BlogEntity;
}
