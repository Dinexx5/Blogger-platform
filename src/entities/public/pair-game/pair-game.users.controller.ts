import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { JwtAccessAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import {
  GetQuestionsPaginationDto,
  QuestionViewModel,
  StatsViewModel,
} from '../../admin/questions/question.models';
import { PairGameService } from './pair-game.service';
import { TopQueryRepository } from './pair-game.stats.query.repository';
import { GetTopPaginationDto } from './dto/get-top.pagination-dto';
import { paginatedViewModel } from '../../../shared/models/pagination';
import { TopViewModel } from './dto/top-view-model';

@Controller('pair-game-quiz/users')
export class PairGameUsersController {
  constructor(
    private readonly pairGameService: PairGameService,
    private readonly topQueryRepository: TopQueryRepository,
  ) {}

  @UseGuards(JwtAccessAuthGuard)
  @Get('my-statistic')
  @HttpCode(HttpStatus.OK)
  async getStats(@CurrentUser() userId): Promise<StatsViewModel> {
    return this.pairGameService.getStats(userId);
  }
  @Get('top')
  @HttpCode(HttpStatus.OK)
  async getTop(@Query() query: GetTopPaginationDto): Promise<paginatedViewModel<TopViewModel[]>> {
    return this.topQueryRepository.getTop(query);
  }
}
