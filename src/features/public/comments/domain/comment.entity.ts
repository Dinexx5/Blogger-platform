import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommentatorInfo } from './commentatorInfo.entity';
import { PostInfoForComment } from './postInfo.entity';
import { CommentLike } from '../../../likes/domain/comment-like.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @Column()
  createdAt: string;
  @OneToOne(() => CommentatorInfo, (ci) => ci.comment)
  commentatorInfo: CommentatorInfo;
  @OneToOne(() => PostInfoForComment, (pi) => pi.comment)
  postInfo: PostInfoForComment;
  @OneToMany(() => CommentLike, (l) => l.comment)
  likes: CommentLike[];
}
