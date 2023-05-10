import { paginatedViewModel } from '../../shared/models/pagination';
import { GetQuestionsPaginationDto, QuestionViewModel } from './question.models';
import { Question } from './domain/question.entity';
import { Repository } from 'typeorm';
export declare class QuestionsQueryRepository {
    private questionsRepository;
    constructor(questionsRepository: Repository<Question>);
    getQuestions(getQuestionsDto: GetQuestionsPaginationDto): Promise<paginatedViewModel<QuestionViewModel[]>>;
}
