import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../../admin/users/domain/user.entity';

@Entity()
export class GamesStats {
  @PrimaryColumn()
  userId: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  sumScore: number;

  @Column({ type: 'decimal', nullable: true })
  avgScores: number;

  @Column({ nullable: true })
  gamesCount: number;

  @Column()
  winsCount: number;

  @Column({ nullable: true })
  lossesCount: number;

  @Column({ nullable: true })
  drawsCount: number;
}
