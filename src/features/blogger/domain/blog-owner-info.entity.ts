import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { User } from '../../admin/users/domain/user.entity';

@Entity()
export class BlogOwnerInfoEntity {
  @Column()
  userLogin: string;
  @ManyToOne(() => BlogEntity)
  @JoinColumn()
  blog: BlogEntity;
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
  @PrimaryColumn()
  blogId: number;
  @Column()
  userId: number;
  static createBlogOwnerInfo(blogId: number, userId: number, userLogin: string) {
    const blogOwnerInfo = new BlogOwnerInfoEntity();
    blogOwnerInfo.blogId = blogId;
    blogOwnerInfo.userId = userId;
    blogOwnerInfo.userLogin = userLogin;
    return blogOwnerInfo;
  }
}
