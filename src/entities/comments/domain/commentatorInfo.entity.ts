import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from '../../users/domain/user.entity';

@Entity()
export class CommentatorInfo {
  @PrimaryColumn()
  commentId: number;
  @Column()
  userLogin: string;
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
  @ManyToOne(() => Comment)
  @JoinColumn()
  comment: Comment;
  @Column()
  userId: number;
}
