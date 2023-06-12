import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from '../../posts/domain/post.entity';
import { BlogEntity } from '../../../blogger/domain/blog.entity';

@Entity()
export class PostInfoForComment {
  @PrimaryColumn()
  commentId: number;
  @Column()
  title: string;
  @Column()
  blogName: string;

  @ManyToOne(() => Post)
  @JoinColumn()
  post: Post;

  @ManyToOne(() => BlogEntity)
  @JoinColumn()
  blog: BlogEntity;

  @ManyToOne(() => Comment)
  @JoinColumn()
  comment: Comment;

  @Column()
  postId: number;
  @Column()
  blogId: number;
}
