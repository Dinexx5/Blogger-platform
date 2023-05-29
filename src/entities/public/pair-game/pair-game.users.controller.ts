import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAccessAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { StatsViewModel } from '../../admin/questions/question.models';
import { PairGameService } from './pair-game.service';

@Controller('pair-game-quiz/users')
export class PairGameUsersController {
  constructor(private readonly pairGameService: PairGameService) {}

  @UseGuards(JwtAccessAuthGuard)
  @Get('my-statistic')
  @HttpCode(HttpStatus.OK)
  async getStats(@CurrentUser() userId): Promise<StatsViewModel> {
    return this.pairGameService.getStats(userId);
  }
}
