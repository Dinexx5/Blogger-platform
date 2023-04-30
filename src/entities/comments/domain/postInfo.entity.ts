import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from '../../posts/domain/post.entity';
import { Blog } from '../../blogs/domain/blog.entity';

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

  @ManyToOne(() => Blog)
  @JoinColumn()
  blog: Blog;

  @OneToOne(() => Comment)
  @JoinColumn()
  comment: Comment;

  @Column()
  postId: number;
  @Column()
  blogId: number;
}
