import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../admin/users/domain/user.entity';
import { PostEntity } from '../../public/posts/domain/post.entity';

@Entity()
export class PostMainPictureEntity {
  @ManyToOne(() => PostEntity)
  @JoinColumn()
  post: PostEntity;
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
  @Column()
  postId: number;
  @Column()
  userId: number;
  @Column()
  width: number;
  @Column()
  height: number;
  @PrimaryColumn()
  relativeUrl: string;
  @Column()
  fileSize: number;
  @Column()
  uploadId: string;
  static async create(
    blogId: number,
    postId: number,
    userId: number,
    height: number,
    width: number,
    sizeName: string,
    ETag: string,
    fileSize: number,
  ): Promise<PostMainPictureEntity> {
    const mainPicture = new PostMainPictureEntity();
    mainPicture.userId = userId;
    mainPicture.postId = postId;
    mainPicture.width = width;
    mainPicture.height = height;
    mainPicture.uploadId = ETag;
    mainPicture.fileSize = fileSize;
    mainPicture.relativeUrl = `https://storage.yandexcloud.net/blogger.platform/content/blogs/${blogId}/posts/${postId}/main/${postId}_main_${sizeName}`;
    return mainPicture;
  }
}
