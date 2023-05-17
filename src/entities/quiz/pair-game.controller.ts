import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PairGameService } from './pair-game.service';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { AnswerViewModel, PairGameViewModel, SubmitAnswerDto } from './question.models';
import { isPairIdIntegerGuard } from '../auth/guards/param.pairId.integer.guard';

@Controller('pair-game-quiz/pairs')
export class PairGameController {
  constructor(private readonly pairGameService: PairGameService) {}

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
