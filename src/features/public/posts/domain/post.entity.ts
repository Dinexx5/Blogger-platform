import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BlogEntity } from '../../../blogger/domain/blog.entity';
import { PostLike } from '../../../likes/domain/post-like.entity';
import { CreatePostDto } from '../../../blogger/dto/create-post-dto';
import { PostMainPictureEntity } from '../../../blogger/domain/post-main-picture.entity';

@Entity()
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  shortDescription: string;
  @Column()
  content: string;
  @Column()
  blogId: number;
  @Column()
  blogName: string;
  @Column()
  createdAt: string;
  @ManyToOne(() => BlogEntity)
  @JoinColumn()
  blog: BlogEntity;
  @OneToMany(() => PostLike, (l) => l.post)
  likes: PostLike[];
  @OneToMany(() => PostMainPictureEntity, (mp) => mp.post)
  mainPictures: PostMainPictureEntity[];
  static createPost(inputModel: CreatePostDto, blogId: number, blogName: string): PostEntity {
    const post = new PostEntity();
    post.title = inputModel.title;
    post.shortDescription = inputModel.shortDescription;
    post.content = inputModel.content;
    post.blogId = blogId;
    post.blogName = blogName;
    post.createdAt = new Date().toISOString();
    return post;
  }
}
