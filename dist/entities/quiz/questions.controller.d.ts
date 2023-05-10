import { QuestionsService } from './questions.service';
import { createQuestionDto, GetQuestionsPaginationDto, publishedUpdateModel, QuestionViewModel, updateQuestionDto } from './question.models';
import { paginatedViewModel } from '../../shared/models/pagination';
import { QuestionsQueryRepository } from './questions.query.repo';
export declare class QuestionsController {
    private readonly questionService;
    private readonly questionsQueryRepo;
    constructor(questionService: QuestionsService, questionsQueryRepo: QuestionsQueryRepository);
    getQuestions(query: GetQuestionsPaginationDto): Promise<paginatedViewModel<QuestionViewModel[]>>;
    createQuestion(questionData: createQuestionDto): Promise<QuestionViewModel>;
    updateQuestion(id: number, questionData: updateQuestionDto): Promise<void>;
    delete(id: number): Promise<void>;
    updatePublishedStatus(id: number, updateModel: publishedUpdateModel): Promise<void>;
}
