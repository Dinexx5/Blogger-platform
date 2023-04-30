import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class EmailConfirmationInfo {
  @Column()
  confirmationCode: string;
  @Column()
  expirationDate: string;
  @Column()
  isConfirmed: boolean;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
  @PrimaryColumn()
  userId: number;
}
