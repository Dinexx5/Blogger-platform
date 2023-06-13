import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { PostEntity } from '../../public/posts/domain/post.entity';
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
  @ManyToOne(() => PostEntity)
  @JoinColumn()
  post: PostEntity;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
