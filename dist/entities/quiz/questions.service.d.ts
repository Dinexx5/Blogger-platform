import { Repository } from 'typeorm';
import { Question } from './domain/question.entity';
import { createQuestionDto, updateQuestionDto } from './question.models';
export declare class QuestionsService {
    private readonly questionRepository;
    constructor(questionRepository: Repository<Question>);
    createQuestion(questionData: createQuestionDto): Promise<Question>;
    updateQuestion(id: number, questionData: updateQuestionDto): Promise<void>;
    deleteQuestion(id: number): Promise<void>;
    updatePublishedStatus(id: number, published: boolean): Promise<void>;
}
