import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from '../../users/domain/user.entity';

@Entity()
export class CommentatorInfo {
  @PrimaryColumn()
  commentId: number;
  @Column()
  userLogin: string;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
  @OneToOne(() => Comment)
  @JoinColumn()
  comment: Comment;
  @Column()
  userId: number;
}
