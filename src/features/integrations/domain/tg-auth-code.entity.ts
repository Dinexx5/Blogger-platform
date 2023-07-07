import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../admin/users/domain/user.entity';

@Entity()
export class TgAuthCodeEntity {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
  @Column()
  userId: number;
  @PrimaryColumn()
  code: string;
  @Column({ nullable: true })
  tgId: string;
  static async createAuthCode(code: string, userId: number) {
    const authCode = new TgAuthCodeEntity();
    authCode.code = code;
    authCode.userId = userId;
    return authCode;
  }
}
