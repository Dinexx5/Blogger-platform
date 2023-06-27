import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { User } from '../../admin/users/domain/user.entity';

@Entity()
export class WallpaperEntity {
  @OneToOne(() => BlogEntity)
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
  url: string;
  @Column()
  width: number;
  @Column()
  height: number;
  @Column()
  fileSize: number;
  @Column()
  uploadId: string;
  static create(blogId: number, userId: number, ETag: string, fileSize: number): WallpaperEntity {
    const wallpaper = new WallpaperEntity();
    wallpaper.userId = userId;
    wallpaper.blogId = blogId;
    wallpaper.width = 1028;
    wallpaper.height = 312;
    wallpaper.uploadId = ETag;
    wallpaper.fileSize = fileSize;
    wallpaper.url = `content/blogs/${blogId}/wallpapers/${blogId}_wallpaper.png`;
    return wallpaper;
  }
}
