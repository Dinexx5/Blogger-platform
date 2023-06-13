import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { User } from '../../admin/users/domain/user.entity';
import { CreateUserBanForBlogDto } from '../dto/create-user-ban-for-blog.dto';

@Entity()
export class UserBanForBlogEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  login: string;
  @Column()
  isBanned: boolean;
  @Column()
  banReason: string;
  @Column()
  banDate: string;
  @Column('int', { array: true })
  bannedPostsIds: number[];
  @Column()
  blogId: number;
  @Column()
  userId: number;
  @ManyToOne(() => BlogEntity)
  @JoinColumn()
  blog: BlogEntity;
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
  static createUserBanForBlog(inputModel: CreateUserBanForBlogDto) {
    const ban = new UserBanForBlogEntity();
    ban.userId = inputModel.userId;
    ban.login = inputModel.login;
    ban.blogId = inputModel.blogId;
    ban.isBanned = true;
    ban.banReason = inputModel.banReason;
    ban.banDate = new Date().toISOString();
    ban.bannedPostsIds = inputModel.bannedPostsIds;
    return ban;
  }
}
