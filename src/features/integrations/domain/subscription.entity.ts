import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../admin/users/domain/user.entity';
import { BlogEntity } from '../../blogger/domain/blog.entity';

@Entity()
export class SubscriptionEntity {
  @ManyToOne(() => BlogEntity)
  @JoinColumn()
  blog: BlogEntity;
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
  @Column()
  userId: number;
  @PrimaryColumn()
  blogId: number;
  @Column({ nullable: true })
  tgId: number;
  static async createSubscription(blogId: number, userId: number) {
    const subscription = new SubscriptionEntity();
    subscription.blogId = blogId;
    subscription.userId = userId;
    return subscription;
  }
}
