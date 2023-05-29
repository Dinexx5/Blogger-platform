import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Post } from '../../public/posts/domain/post.entity';
import { User } from '../../admin/users/domain/user.entity';

@Entity()
export class PostLike {
  @Column()
  likeStatus: string;
  @Column()
  login: string;
  @PrimaryColumn()
  postId: number;
  @Column()
  userId: number;
  @Column()
  createdAt: string;
  @ManyToOne(() => Post)
  @JoinColumn()
  post: Post;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
