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
  width: number;
  @Column()
  height: number;
  @Column()
  url: string;
  @Column()
  fileSize: number;
  @Column()
  uploadId: string;
  static create(blogId: number, userId: number, ETag: string, fileSize: number): MainPictureEntity {
    const main = new MainPictureEntity();
    main.userId = userId;
    main.blogId = blogId;
    main.width = 156;
    main.height = 156;
    main.uploadId = ETag;
    main.fileSize = fileSize;
    main.url = `content/blogs/${blogId}/main/${blogId}_main.png`;
    return main;
  }
}
