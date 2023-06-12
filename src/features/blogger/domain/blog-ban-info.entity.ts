import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BlogEntity } from './blog.entity';

@Entity()
export class BlogBanInfoEntity {
  @Column()
  isBanned: boolean;
  @Column({ nullable: true })
  banDate: string;
  @ManyToOne(() => BlogEntity)
  @JoinColumn()
  blog: BlogEntity;
  @PrimaryColumn()
  blogId: number;
  static createBlogBanInfo(blogId: number) {
    const blogBanInfo = new BlogBanInfoEntity();
    blogBanInfo.blogId = blogId;
    blogBanInfo.isBanned = false;
    blogBanInfo.banDate = null;
    return blogBanInfo;
  }
}
