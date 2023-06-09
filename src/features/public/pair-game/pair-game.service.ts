import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { PairGame } from './domain/pair-game.entity';
import { Question } from '../../admin/questions/domain/question.entity';
import { UsersRepository } from '../../admin/users/users.repository';
import {
  AnswerViewModel,
  PairGameViewModel,
  StatsViewModel,
  SubmitAnswerDto,
} from '../../admin/questions/question.models';
import { PairGameQueryRepository } from './pair-game.query.repository';
import { GamesStats } from './domain/stats.entity';

@Injectable()
export class PairGameService {
  constructor(
    @InjectRepository(PairGame)
    private readonly pairGameRepository: Repository<PairGame>,
    private readonly usersRepository: UsersRepository,
    private readonly pairGameQueryRepository: PairGameQueryRepository,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(GamesStats)
    private readonly statsRepository: Repository<GamesStats>,
  ) {}

  async createPair(playerId: number): Promise<PairGameViewModel> {
    const user = await this.usersRepository.findUserById(playerId);
    const isPlayerInActiveGame: PairGame = await this.pairGameRepository
      .createQueryBuilder('pairGame')
      .where('pairGame.status = :status', { status: 'Active' })
      .andWhere(
        new Brackets((qb) => {
          qb.where('pairGame.firstPlayerId = :userId', { userId: playerId }).orWhere(
            'pairGame.secondPlayerId = :userId',
            { userId: playerId },
          );
        }),
      )
      .getOne();

    if (isPlayerInActiveGame) throw new ForbiddenException();

    const existingPendingPair = await this.pairGameRepository
      .createQueryBuilder('pairGame')
      .where('pairGame.status = :status', { status: 'PendingSecondPlayer' })
      .getOne();

    if (existingPendingPair) {
      if (existingPendingPair.firstPlayerProgress.player.id === playerId) {
        throw new ForbiddenException();
      }
      existingPendingPair.secondPlayerProgress = {
        player: {
          id: playerId,
          login: user.login,
        },
        answers: [],
        score: 0,
        allQuestionsAnsweredDate: null,
      };
      existingPendingPair.secondPlayerId = playerId;
      existingPendingPair.questions = await this.getRandomQuestions();
      existingPendingPair.status = 'Active';
      existingPendingPair.startGameDate = new Date().toISOString();

      const savedExistingPendingPair = await this.pairGameRepository.save(existingPendingPair);
      return this.pairGameQueryRepository.mapPairToViewModel(savedExistingPendingPair);
    }

    const newPair = await this.pairGameRepository.create();
    newPair.firstPlayerProgress = {
      player: {
        id: playerId,
        login: user.login,
      },
      answers: [],
      score: 0,
      allQuestionsAnsweredDate: null,
    };

    newPair.status = 'PendingSecondPlayer';
    newPair.pairCreatedDate = new Date().toISOString();
    newPair.firstPlayerId = playerId;

    const savedNewPair = await this.pairGameRepository.save(newPair);
    return this.pairGameQueryRepository.mapPairToViewModel(savedNewPair);
  }

  async getRandomQuestions(): Promise<{ id: number; body: string }[]> {
    return await this.questionRepository
      .createQueryBuilder()
      .select(['id', 'body'])
      .orderBy('RANDOM()')
      .limit(5)
      .getRawMany();
  }

  async submitAnswer(userId: number, answerDto: SubmitAnswerDto): Promise<AnswerViewModel> {
    const currentPairGame: PairGame = await this.pairGameRepository
      .createQueryBuilder('pairGame')
      .where('pairGame.status = :status', { status: 'Active' })
      .andWhere(
        new Brackets((qb) => {
          qb.where('pairGame.firstPlayerId = :userId', { userId: userId }).orWhere(
            'pairGame.secondPlayerId = :userId',
            { userId: userId },
          );
        }),
      )
      .getOne();
    if (!currentPairGame) {
      throw new ForbiddenException();
    }
    const firstPlayerId = currentPairGame.firstPlayerProgress.player.id;
    const secondPlayerId = currentPairGame.secondPlayerProgress.player.id;
    const firstPlayerAnswers = currentPairGame.firstPlayerProgress.answers;
    const secondPlayerAnswers = currentPairGame.secondPlayerProgress.answers;
    const firstPlayerAnsweredAllQuestionsDate =
      currentPairGame.firstPlayerProgress.allQuestionsAnsweredDate;
    const secondPlayerAnsweredAllQuestionsDate =
      currentPairGame.secondPlayerProgress.allQuestionsAnsweredDate;

    if (firstPlayerId !== userId && secondPlayerId !== userId) {
      throw new ForbiddenException();
    }

    // Determine which question player is trying to answer
    const currentQuestionIndex =
      firstPlayerId === userId ? firstPlayerAnswers.length : secondPlayerAnswers.length;
    if (currentQuestionIndex === 5) throw new ForbiddenException();

    // Get full question from db
    const currentQuestion = currentPairGame.questions[currentQuestionIndex];
    const fullQuestion: Question = await this.questionRepository.findOneBy({
      id: currentQuestion.id,
    });

    //Check if there is a time limit for player to answer all questions

    // if (
    //   (userId === firstPlayerId && secondPlayerAnsweredAllQuestionsDate) ||
    //   (userId === secondPlayerId && firstPlayerAnsweredAllQuestionsDate)
    // ) {
    //   const isTimeLimitExceeded = await this.checkIfPlayerExceededTimeLimit(
    //     userId,
    //     currentPairGame,
    //   );
    //   if (isTimeLimitExceeded)
    //     return {
    //       questionId: currentQuestion.id.toString(),
    //       addedAt: new Date().toISOString(),
    //       answerStatus: 'Incorrect',
    //     };
    // }

    // Compare the given answer with correct answer
    const correctAnswers: string[] = fullQuestion.correctAnswers[0]
      .split(',')
      .map((answer) => answer.trim().toLowerCase());
    const answerStatus: 'Correct' | 'Incorrect' = correctAnswers.includes(
      answerDto.answer.toLowerCase(),
    )
      ? 'Correct'
      : 'Incorrect';

    const answerModel = {
      questionId: currentQuestion.id,
      addedAt: new Date().toISOString(),
      answerStatus: answerStatus,
    };

    // Saving user's response
    if (firstPlayerId === userId) {
      firstPlayerAnswers.push(answerModel);
    } else {
      secondPlayerAnswers.push(answerModel);
    }

    // Updating progress of a player
    if (firstPlayerId === userId) {
      currentPairGame.firstPlayerProgress.score += answerStatus === 'Correct' ? 1 : 0;
    } else {
      currentPairGame.secondPlayerProgress.score += answerStatus === 'Correct' ? 1 : 0;
    }

    // Determine if one of the players answered all questions and set Date

    const firstPlayerAnsweredLastQuestion =
      currentPairGame.firstPlayerProgress.answers.length === 5 &&
      firstPlayerAnsweredAllQuestionsDate === null;

    if (firstPlayerAnsweredLastQuestion) {
      currentPairGame.firstPlayerProgress.allQuestionsAnsweredDate = new Date().toISOString();
      setTimeout(this.checkIfPlayerExceededTimeLimit.bind(this), 10000, userId, currentPairGame.id);
    }

    const secondPlayerAnsweredLastQuestion =
      currentPairGame.secondPlayerProgress.answers.length === 5 &&
      secondPlayerAnsweredAllQuestionsDate === null;

    if (secondPlayerAnsweredLastQuestion) {
      currentPairGame.secondPlayerProgress.allQuestionsAnsweredDate = new Date().toISOString();
      setTimeout(this.checkIfPlayerExceededTimeLimit.bind(this), 10000, userId, currentPairGame.id);
    }

    // Game finish
    const gameFinished = firstPlayerAnswers.length === 5 && secondPlayerAnswers.length === 5;

    // Save game changes
    await this.pairGameRepository.save(currentPairGame);

    if (gameFinished) {
      await this.finishTheGame(currentPairGame);
    }

    return {
      questionId: answerModel.questionId.toString(),
      addedAt: answerModel.addedAt,
      answerStatus: answerModel.answerStatus,
    };
  }

  async finishTheGame(currentPairGame: PairGame) {
    currentPairGame.status = 'Finished';
    currentPairGame.finishGameDate = new Date().toISOString();

    // Additional score point
    if (
      currentPairGame.firstPlayerProgress.answers[4].addedAt <
        currentPairGame.secondPlayerProgress.answers[4].addedAt &&
      currentPairGame.firstPlayerProgress.answers.some(
        (answer) => answer.answerStatus === 'Correct',
      )
    ) {
      currentPairGame.firstPlayerProgress.score += 1;
    }
    if (
      currentPairGame.firstPlayerProgress.answers[4].addedAt >
        currentPairGame.secondPlayerProgress.answers[4].addedAt &&
      currentPairGame.secondPlayerProgress.answers.some(
        (answer) => answer.answerStatus === 'Correct',
      )
    ) {
      currentPairGame.secondPlayerProgress.score += 1;
    }

    await this.pairGameRepository.save(currentPairGame);

    // Update players stats

    const isFirstPlayerWon =
      currentPairGame.firstPlayerProgress.score > currentPairGame.secondPlayerProgress.score;
    const isDraw =
      currentPairGame.firstPlayerProgress.score === currentPairGame.secondPlayerProgress.score;
    const isSecondPlayerWon =
      currentPairGame.firstPlayerProgress.score < currentPairGame.secondPlayerProgress.score;

    await this.updateStatisticForFirstPlayer(
      currentPairGame.firstPlayerId,
      currentPairGame.firstPlayerProgress.score,
      isFirstPlayerWon,
      isDraw,
      isSecondPlayerWon,
    );
    await this.updateStatisticForSecondPlayer(
      currentPairGame.secondPlayerId,
      currentPairGame.secondPlayerProgress.score,
      isFirstPlayerWon,
      isDraw,
      isSecondPlayerWon,
    );
  }

  async checkIfPlayerExceededTimeLimit(userId: number, currentPairGameId: number) {
    const currentPairGame = await this.pairGameRepository.findOneBy({ id: currentPairGameId });
    const opponentsProgress =
      userId === currentPairGame.firstPlayerId
        ? currentPairGame.secondPlayerProgress
        : currentPairGame.firstPlayerProgress;

    if (opponentsProgress.answers.length < 5) {
      const currentAnswers = opponentsProgress.answers.length;
      for (let i = currentAnswers + 1; i <= 5; i++) {
        opponentsProgress.answers.push({
          questionId: currentPairGame.questions[i - 1].id,
          addedAt: new Date().toISOString(),
          answerStatus: 'Incorrect',
        });
      }
      await this.finishTheGame(currentPairGame);
    }
  }

  async updateStatisticForFirstPlayer(
    firstPlayerId: number,
    firstPlayerScore: number,
    isFirstPlayerWon: boolean,
    isDraw: boolean,
    isSecondPlayerWon: boolean,
  ) {
    const firstPlayerStats = await this.statsRepository.findOneBy({ userId: firstPlayerId });
    if (!firstPlayerStats) {
      const newFirstPlayerStats = await this.statsRepository.create();
      newFirstPlayerStats.userId = firstPlayerId;
      newFirstPlayerStats.gamesCount = 1;
      newFirstPlayerStats.avgScores = firstPlayerScore;
      newFirstPlayerStats.sumScore = firstPlayerScore;
      newFirstPlayerStats.winsCount = isFirstPlayerWon ? 1 : 0;
      newFirstPlayerStats.drawsCount = isDraw ? 1 : 0;
      newFirstPlayerStats.lossesCount = isSecondPlayerWon ? 1 : 0;
      await this.statsRepository.save(newFirstPlayerStats);
      return;
    }

    firstPlayerStats.gamesCount += 1;
    firstPlayerStats.sumScore += firstPlayerScore;
    firstPlayerStats.avgScores = +(
      firstPlayerStats.sumScore / firstPlayerStats.gamesCount || 0
    ).toFixed(2);
    if (isFirstPlayerWon) firstPlayerStats.winsCount++;
    if (isDraw) firstPlayerStats.drawsCount++;
    if (isSecondPlayerWon) firstPlayerStats.lossesCount++;
    await this.statsRepository.save(firstPlayerStats);
  }
  async updateStatisticForSecondPlayer(
    secondPlayerId: number,
    secondPlayerScore: number,
    isFirstPlayerWon: boolean,
    isDraw: boolean,
    isSecondPlayerWon: boolean,
  ) {
    const secondPlayerStats = await this.statsRepository.findOneBy({ userId: secondPlayerId });

    if (!secondPlayerStats) {
      const newSecondPlayerStats = await this.statsRepository.create();
      newSecondPlayerStats.userId = secondPlayerId;
      newSecondPlayerStats.gamesCount = 1;
      newSecondPlayerStats.avgScores = secondPlayerScore;
      newSecondPlayerStats.sumScore = secondPlayerScore;
      newSecondPlayerStats.winsCount = isSecondPlayerWon ? 1 : 0;
      newSecondPlayerStats.drawsCount = isDraw ? 1 : 0;
      newSecondPlayerStats.lossesCount = isFirstPlayerWon ? 1 : 0;
      await this.statsRepository.save(newSecondPlayerStats);
      return;
    }

    secondPlayerStats.gamesCount += 1;
    secondPlayerStats.sumScore += secondPlayerScore;
    secondPlayerStats.avgScores = +(
      secondPlayerStats.sumScore / secondPlayerStats.gamesCount || 0
    ).toFixed(2);
    if (isFirstPlayerWon) secondPlayerStats.lossesCount++;
    if (isDraw) secondPlayerStats.drawsCount++;
    if (isSecondPlayerWon) secondPlayerStats.winsCount++;
    await this.statsRepository.save(secondPlayerStats);
  }

  async getCurrentPair(userId: number): Promise<PairGameViewModel | null> {
    const existingPendingPair = await this.pairGameRepository
      .createQueryBuilder('pairGame')
      .where('pairGame.status = :status', { status: 'PendingSecondPlayer' })
      .andWhere('pairGame.firstPlayerId = :userId', { userId: userId })
      .getOne();
    if (existingPendingPair) {
      return this.pairGameQueryRepository.mapPairToViewModel(existingPendingPair);
    }
    const existingPair: PairGame = await this.pairGameRepository
      .createQueryBuilder('pairGame')
      .where('pairGame.status = :status', { status: 'Active' })
      .andWhere(
        new Brackets((qb) => {
          qb.where('pairGame.firstPlayerId = :userId', { userId: userId }).orWhere(
            'pairGame.secondPlayerId = :userId',
            { userId: userId },
          );
        }),
      )
      .getOne();
    if (!existingPair) throw new NotFoundException();
    return this.pairGameQueryRepository.mapPairToViewModel(existingPair);
  }

  async getPairById(pairId: number, userId: number): Promise<PairGameViewModel | null> {
    const existingPair = await this.pairGameRepository.findOneBy({ id: pairId });
    if (!existingPair) throw new NotFoundException();
    if (
      existingPair.status === 'PendingSecondPlayer' &&
      existingPair.firstPlayerProgress.player.id !== userId
    ) {
      throw new ForbiddenException();
    }
    if (
      existingPair.firstPlayerProgress.player.id !== userId &&
      existingPair.secondPlayerProgress.player.id !== userId
    ) {
      throw new ForbiddenException();
    }
    return this.pairGameQueryRepository.mapPairToViewModel(existingPair);
  }
  async getStats(userId: number): Promise<StatsViewModel> {
    const stats = await this.statsRepository.findOneBy({ userId: userId });
    if (!stats) throw new ForbiddenException();
    return {
      sumScore: stats.sumScore,
      avgScores: +stats.avgScores,
      gamesCount: stats.gamesCount,
      winsCount: stats.winsCount,
      lossesCount: stats.lossesCount,
      drawsCount: stats.drawsCount,
    };
  }
}
