import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../admin/users/domain/user.entity';
import { BlogEntity } from '../../blogger/domain/blog.entity';

@Entity()
export class SubscriptionEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => BlogEntity)
  @JoinColumn()
  blog: BlogEntity;
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
  @Column()
  userId: number;
  @Column()
  blogId: number;
  @Column({ nullable: true })
  tgId: number;
  @Column()
  status: 'Subscribed' | 'Unsubscribed';
  static async createSubscription(blogId: number, userId: number, tgId?: number) {
    const subscription = new SubscriptionEntity();
    subscription.blogId = blogId;
    subscription.userId = userId;
    subscription.tgId = tgId || null;
    subscription.status = 'Subscribed';
    return subscription;
  }
}
