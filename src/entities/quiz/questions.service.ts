import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './domain/question.entity';
import { createQuestionDto, QuestionViewModel, updateQuestionDto } from './question.models';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async createQuestion(questionData: createQuestionDto): Promise<QuestionViewModel> {
    new Date().toISOString();
    const question = this.questionRepository.create({
      ...questionData,
      published: false,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    });
    await this.questionRepository.save(question);
    return {
      id: question.id.toString(),
      body: question.body,
      correctAnswers: question.correctAnswers,
      published: question.published,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  async updateQuestion(id: number, questionData: updateQuestionDto) {
    const question = await this.questionRepository.preload({
      id,
      ...questionData,
      updatedAt: new Date().toISOString(),
    });
    if (!question) {
      throw new NotFoundException();
    }
    await this.questionRepository.save(question);
  }

  async deleteQuestion(id: number) {
    const result = await this.questionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
  async updatePublishedStatus(id: number, published: boolean) {
    const question = await this.questionRepository.findOneBy({ id: id });
    if (!question) {
      throw new NotFoundException();
    }
    question.published = published;
    await this.questionRepository.save(question);
  }
}
