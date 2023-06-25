import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../admin/users/domain/user.entity';
import { PostEntity } from '../../public/posts/domain/post.entity';

@Entity()
export class PostMainPictureEntity {
  @OneToOne(() => PostEntity)
  @JoinColumn()
  post: PostEntity;
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
  @PrimaryColumn()
  postId: number;
  @Column()
  userId: number;
  @Column()
  relativeUrl: string;
  @Column()
  fileSize: number;
  @Column()
  uploadId: string;
  static create(
    blogId: number,
    postId: number,
    userId: number,
    ETag: string,
    fileSize: number,
  ): PostMainPictureEntity {
    const mainPicture = new PostMainPictureEntity();
    mainPicture.userId = userId;
    mainPicture.postId = postId;
    mainPicture.uploadId = ETag;
    mainPicture.fileSize = fileSize;
    mainPicture.relativeUrl = `content/blogs/${blogId}/posts/${postId}/main/${postId}_main`;
    return mainPicture;
  }
}
