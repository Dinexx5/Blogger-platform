import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
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
  @UseGuards(AuthGuard)
  @Put(':questionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateQuestion(
    @Param('questionId', ParseIntPipe) id: number,
    @Body() questionData: updateQuestionDto,
  ) {
    await this.questionService.updateQuestion(id, questionData);
  }
  @UseGuards(AuthGuard)
  @Delete(':questionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('questionId', ParseIntPipe) id: number) {
    await this.questionService.deleteQuestion(id);
  }
  @UseGuards(AuthGuard)
  @Put(':questionId/publish')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePublishedStatus(
    @Param('questionId', ParseIntPipe) id: number,
    @Body() updateModel: publishedUpdateModel,
  ) {
    await this.questionService.updatePublishedStatus(id, updateModel.published);
  }
}
