import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/domain/user.entity';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  lastActiveDate: string;
  @Column()
  title: string;
  @Column()
  deviceId: string;
  @Column()
  ip: string;
  @Column()
  userId: number;
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
