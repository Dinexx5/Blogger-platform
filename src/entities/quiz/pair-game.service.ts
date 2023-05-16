import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PairGame } from './domain/pair-game.entity';
import { Question } from './domain/question.entity';
import { UsersRepository } from '../users/users.repository';
import { AnswerViewModel, SubmitAnswerDto } from './question.models';

@Injectable()
export class PairGameService {
  constructor(
    @InjectRepository(PairGame)
    private readonly pairGameRepository: Repository<PairGame>,
    private readonly usersRepository: UsersRepository,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async createPair(playerId: number): Promise<PairGame> {
    const user = await this.usersRepository.findUserById(playerId);
    const existingPair = await this.pairGameRepository
      .createQueryBuilder('pairGame')
      .where('pairGame.status != :status', { status: 'Finished' })
      .getOne();

    if (existingPair) {
      if (
        existingPair.firstPlayerProgress.player.id === playerId ||
        existingPair.status === 'Active'
      ) {
        throw new ForbiddenException();
      }
      existingPair.secondPlayerProgress = {
        player: {
          id: playerId,
          login: user.login,
        },
        answers: [],
        score: 0,
      };
      const randomQuestions = await this.getRandomQuestions();
      existingPair.questions = randomQuestions;
      existingPair.status = 'Active';
      existingPair.startGameDate = new Date().toISOString();

      await this.pairGameRepository.save(existingPair);

      return existingPair;
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

    return this.pairGameRepository.save(newPair);
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
    const currentPairGame = await this.pairGameRepository
      .createQueryBuilder('pairGame')
      .where('pairGame.status != :status', { status: 'Finished' })
      .getOne();
    const firstPlayerId = currentPairGame.firstPlayerProgress.player.id;
    const secondPlayerId = currentPairGame.secondPlayerProgress.player.id;
    const firstPlayerAnswers = currentPairGame.firstPlayerProgress.answers;
    const secondPlayerAnswers = currentPairGame.secondPlayerProgress.answers;

    if (!currentPairGame || currentPairGame.status !== 'Active') {
      throw new ForbiddenException();
    }
    if (firstPlayerId !== userId && secondPlayerId !== userId) {
      throw new ForbiddenException();
    }

    // Determine which questions player is trying to answer
    const currentQuestionIndex =
      firstPlayerId === userId ? firstPlayerAnswers.length : secondPlayerAnswers.length;

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
  async getCurrentPair(userId: number): Promise<PairGame | null> {
    const existingPair = await this.pairGameRepository
      .createQueryBuilder('pairGame')
      .where('pairGame.status != :status', { status: 'Finished' })
      .getOne();

    if (
      !existingPair ||
      (existingPair.firstPlayerProgress.player.id !== userId &&
        existingPair.secondPlayerProgress.player.id !== userId)
    ) {
      throw new NotFoundException();
    }
    return existingPair;
  }
  async getPairById(pairId: number, userId: number): Promise<PairGame | null> {
    const existingPair = await this.pairGameRepository.findOneBy({ id: pairId });
    if (!existingPair) throw new NotFoundException();
    if (
      existingPair.firstPlayerProgress.player.id !== userId &&
      existingPair.secondPlayerProgress.player.id !== userId
    ) {
      throw new ForbiddenException();
    }
    return existingPair;
  }
}
