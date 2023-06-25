import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { User } from '../../admin/users/domain/user.entity';

@Entity()
export class MainPictureEntity {
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
  @Column()
  relativeUrl: string;
  @Column()
  fileSize: number;
  @Column()
  uploadId: string;
  static create(blogId: number, userId: number, ETag: string, fileSize: number): MainPictureEntity {
    const wallpaper = new MainPictureEntity();
    wallpaper.userId = userId;
    wallpaper.blogId = blogId;
    wallpaper.uploadId = ETag;
    wallpaper.fileSize = fileSize;
    wallpaper.relativeUrl = `content/blogs/${blogId}/main/${blogId}_main.png`;
    return wallpaper;
  }
}
