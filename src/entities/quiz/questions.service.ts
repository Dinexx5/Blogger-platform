import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './domain/question.entity';
import { createQuestionDto, updateQuestionDto } from './question.models';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async createQuestion(questionData: createQuestionDto): Promise<Question> {
    const now = new Date().toISOString();
    const question = this.questionRepository.create({
      ...questionData,
      published: false,
      createdAt: now,
      updatedAt: now,
    });
    return this.questionRepository.save(question);
  }

  async updateQuestion(id: number, questionData: updateQuestionDto) {
    const now = new Date().toISOString();
    const question = await this.questionRepository.preload({
      id,
      ...questionData,
      updatedAt: now,
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
