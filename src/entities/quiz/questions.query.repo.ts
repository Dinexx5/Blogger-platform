import { paginatedViewModel } from '../../shared/models/pagination';
import { GetQuestionsPaginationDto, QuestionViewModel } from './question.models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './domain/question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionsQueryRepository {
  constructor(@InjectRepository(Question) private questionsRepository: Repository<Question>) {}
  mapFoundQuestionsToViewModel(question): QuestionViewModel {
    return {
      id: question.id.toString(),
      body: question.body,
      correctAnswers: question.correctAnswers,
      published: question.published,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }
  async getQuestions(
    getQuestionsDto: GetQuestionsPaginationDto,
  ): Promise<paginatedViewModel<QuestionViewModel[]>> {
    const {
      searchBodyTerm,
      publishedStatus = 'all',
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = getQuestionsDto;

    const builder = this.questionsRepository.createQueryBuilder('q');

    if (searchBodyTerm) {
      builder.andWhere('LOWER(q.body) LIKE LOWER(:searchBodyTerm)', {
        searchBodyTerm: `%${searchBodyTerm}%`,
      });
    }

    if (publishedStatus !== 'all') {
      builder.andWhere('q.published = :publishedStatus', {
        publishedStatus: publishedStatus === 'published',
      });
    }

    builder.orderBy(`q.${sortBy}`, sortDirection === 'desc' ? 'DESC' : 'ASC');

    const [questions, totalCount] = await builder
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .getManyAndCount();

    const questionsView = questions.map(this.mapFoundQuestionsToViewModel);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items: questionsView,
    };
  }
}
