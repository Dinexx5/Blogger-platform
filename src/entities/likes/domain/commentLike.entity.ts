import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../users/domain/user.entity';
import { Comment } from '../../comments/domain/comment.entity';

@Entity()
export class CommentLike {
  @Column()
  likeStatus: string;
  @PrimaryColumn()
  commentId: number;
  @Column()
  userId: number;
  @Column()
  createdAt: string;
  @ManyToOne(() => Comment)
  @JoinColumn()
  comment: Comment;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
