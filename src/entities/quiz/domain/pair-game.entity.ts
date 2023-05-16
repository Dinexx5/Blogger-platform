import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PairGame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'json' })
  firstPlayerProgress: {
    answers: {
      questionId: number;
      answerStatus: 'Correct' | 'Incorrect';
      addedAt: string;
    }[];
    player: {
      id: number;
      login: string;
    };
    score: number;
  };

  @Column({ nullable: true, type: 'json' })
  secondPlayerProgress: {
    answers: {
      questionId: number;
      answerStatus: 'Correct' | 'Incorrect';
      addedAt: string;
    }[];
    player: {
      id: number;
      login: string;
    };
    score: number;
  };

  @Column({ nullable: true, type: 'json' })
  questions: {
    id: number;
    body: string;
  }[];

  @Column({ default: 'PendingSecondPlayer' })
  status: 'PendingSecondPlayer' | 'Active' | 'Finished';

  @Column()
  pairCreatedDate: string;

  @Column({ nullable: true })
  startGameDate: string;

  @Column({ nullable: true })
  finishGameDate: string;
}
