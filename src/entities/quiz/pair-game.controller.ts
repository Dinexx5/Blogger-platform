import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PairGameService } from './pair-game.service';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import {
  AnswerViewModel,
  GetPairGamesPaginationDto,
  PairGameViewModel,
  StatsViewModel,
  SubmitAnswerDto,
} from './question.models';
import { isPairIdIntegerGuard } from '../auth/guards/param.pairId.integer.guard';
import { PairGameQueryRepository } from './pair-game.query.repository';
import { paginatedViewModel } from '../../shared/models/pagination';

@Controller('pair-game-quiz/pairs')
export class PairGameController {
  constructor(
    private readonly pairGameService: PairGameService,
    private readonly pairGameQueryRepository: PairGameQueryRepository,
  ) {}

  @UseGuards(JwtAccessAuthGuard)
  @Post('connection')
  @HttpCode(HttpStatus.OK)
  async createPair(@CurrentUser() userId): Promise<PairGameViewModel> {
    return this.pairGameService.createPair(userId);
  }
  @UseGuards(JwtAccessAuthGuard)
  @Post('my-current/answers')
  @HttpCode(HttpStatus.OK)
  async submitAnswer(
    @Body() answerDto: SubmitAnswerDto,
    @CurrentUser() userId,
  ): Promise<AnswerViewModel> {
    return this.pairGameService.submitAnswer(userId, answerDto);
  }
  @UseGuards(JwtAccessAuthGuard)
  @Get('my-current')
  @HttpCode(HttpStatus.OK)
  async gerCurrentPair(@CurrentUser() userId): Promise<PairGameViewModel | null> {
    return this.pairGameService.getCurrentPair(userId);
  }
  @UseGuards(JwtAccessAuthGuard)
  @Get('my')
  async getAllUserGames(
    @Query() query: GetPairGamesPaginationDto,
    @CurrentUser() userId,
  ): Promise<paginatedViewModel<PairGameViewModel[]>> {
    return this.pairGameQueryRepository.getAllUserGames(userId, query);
  }
  @UseGuards(JwtAccessAuthGuard)
  @Get('my-statistic')
  @HttpCode(HttpStatus.OK)
  async getStats(@CurrentUser() userId): Promise<StatsViewModel> {
    return this.pairGameService.getStats(userId);
  }
  @UseGuards(JwtAccessAuthGuard, isPairIdIntegerGuard)
  @Get(':pairId')
  @HttpCode(HttpStatus.OK)
  async getPairById(
    @Param('pairId') pairId: number,
    @CurrentUser() userId,
  ): Promise<PairGameViewModel | null> {
    return this.pairGameService.getPairById(pairId, userId);
  }
}
