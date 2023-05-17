import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { PairGame } from './domain/pair-game.entity';
import { Question } from './domain/question.entity';
import { UsersRepository } from '../users/users.repository';
import { AnswerViewModel, PairGameViewModel, SubmitAnswerDto } from './question.models';

@Injectable()
export class PairGameService {
  constructor(
    @InjectRepository(PairGame)
    private readonly pairGameRepository: Repository<PairGame>,
    private readonly usersRepository: UsersRepository,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
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
      };
      existingPendingPair.secondPlayerId = playerId;
      const randomQuestions = await this.getRandomQuestions();
      existingPendingPair.questions = randomQuestions;
      existingPendingPair.status = 'Active';
      existingPendingPair.startGameDate = new Date().toISOString();

      const savedExistingPendingPair = await this.pairGameRepository.save(existingPendingPair);
      return this.mapPairToViewModel(savedExistingPendingPair);
    }

    const newPair = await this.pairGameRepository.create();
    newPair.firstPlayerProgress = {
      player: {
        id: playerId,
        login: user.login,
      },
      answers: [],
      score: 0,
    };

    newPair.status = 'PendingSecondPlayer';
    newPair.pairCreatedDate = new Date().toISOString();
    newPair.firstPlayerId = playerId;

    const savedNewPair = await this.pairGameRepository.save(newPair);
    return this.mapPairToViewModel(savedNewPair);
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

    if (firstPlayerId !== userId && secondPlayerId !== userId) {
      throw new ForbiddenException();
    }

    // Determine which questions player is trying to answer
    const currentQuestionIndex =
      firstPlayerId === userId ? firstPlayerAnswers.length : secondPlayerAnswers.length;
    if (currentQuestionIndex === 5) throw new ForbiddenException();

    // Get full question from db
    const currentQuestion = currentPairGame.questions[currentQuestionIndex];
    const fullQuestion: Question = await this.questionRepository.findOneBy({
      id: currentQuestion.id,
    });
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

    // Game finish
    const gameFinished = firstPlayerAnswers.length === 5 && secondPlayerAnswers.length === 5;

    if (gameFinished) {
      currentPairGame.status = 'Finished';
      currentPairGame.finishGameDate = new Date().toISOString();
    }
    // Additional score point
    if (
      gameFinished &&
      firstPlayerAnswers[4].addedAt < secondPlayerAnswers[4].addedAt &&
      firstPlayerAnswers.some((answer) => answer.answerStatus === 'Correct')
    ) {
      currentPairGame.firstPlayerProgress.score += 1;
    }
    if (
      gameFinished &&
      firstPlayerAnswers[4].addedAt > secondPlayerAnswers[4].addedAt &&
      secondPlayerAnswers.some((answer) => answer.answerStatus === 'Correct')
    ) {
      currentPairGame.secondPlayerProgress.score += 1;
    }

    await this.pairGameRepository.save(currentPairGame);

    return answerModel;
  }

  async getCurrentPair(userId: number): Promise<PairGameViewModel | null> {
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
    return this.mapPairToViewModel(existingPair);
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
    return this.mapPairToViewModel(existingPair);
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
