import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetPairGamesPaginationDto, PairGameViewModel } from './question.models';
import { paginatedViewModel } from '../../shared/models/pagination';
import { PairGame } from './domain/pair-game.entity';

@Injectable()
export class PairGameQueryRepository {
  constructor(
    @InjectRepository(PairGame)
    private pairGameRepository: Repository<PairGame>,
  ) {}

  async getAllUserGames(
    userId: number,
    paginationDto: GetPairGamesPaginationDto,
  ): Promise<paginatedViewModel<PairGameViewModel[]>> {
    const {
      sortBy = 'pairCreatedDate',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = paginationDto;

    const [pairGames, totalCount] = await this.pairGameRepository
      .createQueryBuilder('pairGame')
      .where('pairGame.firstPlayerId = :userId', { userId })
      .orWhere('pairGame.secondPlayerId = :userId', { userId })
      .orderBy(`pairGame.${sortBy}`, sortDirection === 'desc' ? 'DESC' : 'ASC')
      .addOrderBy('pairGame.pairCreatedDate', 'DESC')
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .getManyAndCount();

    const pairGamesView = pairGames.map(this.mapPairToViewModel);
    console.log('hi there');
    console.log(pairGamesView);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items: pairGamesView,
    };
  }
  mapPairToViewModel(pairGame: PairGame): PairGameViewModel {
    return {
      id: pairGame.id.toString(),
      firstPlayerProgress: {
        answers: pairGame.firstPlayerProgress.answers.map((answer) => ({
          questionId: answer.questionId.toString(),
          answerStatus: answer.answerStatus,
          addedAt: answer.addedAt,
        })),
        player: {
          id: pairGame.firstPlayerProgress.player.id.toString(),
          login: pairGame.firstPlayerProgress.player.login,
        },
        score: pairGame.firstPlayerProgress.score,
      },
      secondPlayerProgress: pairGame.secondPlayerProgress
        ? {
            answers: pairGame.secondPlayerProgress.answers.map((answer) => ({
              questionId: answer.questionId.toString(),
              answerStatus: answer.answerStatus,
              addedAt: answer.addedAt,
            })),
            player: {
              id: pairGame.secondPlayerProgress.player.id.toString(),
              login: pairGame.secondPlayerProgress?.player.login,
            },
            score: pairGame.secondPlayerProgress.score,
          }
        : null,
      questions: pairGame.questions
        ? pairGame.questions.map((question) => ({
            id: question.id.toString(),
            body: question.body,
          }))
        : null,
      status: pairGame.status,
      pairCreatedDate: pairGame.pairCreatedDate,
      startGameDate: pairGame.startGameDate || null,
      finishGameDate: pairGame.finishGameDate || null,
    };
  }
}
