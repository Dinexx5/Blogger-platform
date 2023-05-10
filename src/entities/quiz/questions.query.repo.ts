import { paginatedViewModel } from '../../shared/models/pagination';
import { GetQuestionsPaginationDto, QuestionViewModel } from './question.models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './domain/question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionsQueryRepository {
  constructor(@InjectRepository(Question) private questionsRepository: Repository<Question>) {}

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

    const query = this.questionsRepository.createQueryBuilder('q');

    if (searchBodyTerm) {
      query.andWhere('q.body LIKE :searchBodyTerm', {
        searchBodyTerm: `%${searchBodyTerm}%`,
      });
    }

    if (publishedStatus !== 'all') {
      query.andWhere('q.published = :publishedStatus', {
        publishedStatus: publishedStatus === 'published',
      });
    }

    query.orderBy(`q.${sortBy}`, sortDirection === 'desc' ? 'DESC' : 'ASC');

    const [questions, totalCount] = await query
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .getManyAndCount();

    return {
      pagesCount: Math.ceil(totalCount / +pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: questions,
    };
  }
}
