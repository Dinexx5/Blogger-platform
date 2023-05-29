import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../admin/users/domain/user.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  issuedAt: string;
  @Column()
  expiredAt: string;
  @Column()
  deviceId: string;
  @Column()
  deviceName: string;
  @Column()
  ip: string;
  @Column()
  userId: number;
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
