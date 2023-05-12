import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import {
  createQuestionDto,
  GetQuestionsPaginationDto,
  publishedUpdateModel,
  QuestionViewModel,
  updateQuestionDto,
} from './question.models';
import { paginatedViewModel } from '../../shared/models/pagination';
import { QuestionsQueryRepository } from './questions.query.repo';
import { AuthGuard } from '../auth/guards/auth.guard';
import { isQuestionIdIntegerGuard } from '../auth/guards/param.questionId.integer.guard';

@Controller('sa/quiz/questions')
export class QuestionsController {
  constructor(
    private readonly questionService: QuestionsService,
    private readonly questionsQueryRepo: QuestionsQueryRepository,
  ) {}
  @UseGuards(AuthGuard)
  @Get()
  async getQuestions(
    @Query() query: GetQuestionsPaginationDto,
  ): Promise<paginatedViewModel<QuestionViewModel[]>> {
    return this.questionsQueryRepo.getQuestions(query);
  }
  @UseGuards(AuthGuard)
  @Post()
  async createQuestion(@Body() questionData: createQuestionDto): Promise<QuestionViewModel> {
    return this.questionService.createQuestion(questionData);
  }
  @UseGuards(AuthGuard, isQuestionIdIntegerGuard)
  @Put(':questionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateQuestion(@Param('questionId') id: number, @Body() questionData: updateQuestionDto) {
    await this.questionService.updateQuestion(id, questionData);
  }
  @UseGuards(AuthGuard, isQuestionIdIntegerGuard)
  @Delete(':questionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('questionId') id: number) {
    await this.questionService.deleteQuestion(id);
  }
  @UseGuards(AuthGuard, isQuestionIdIntegerGuard)
  @Put(':questionId/publish')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePublishedStatus(
    @Param('questionId') id: number,
    @Body() updateModel: publishedUpdateModel,
  ) {
    await this.questionService.updatePublishedStatus(id, updateModel.published);
  }
}
