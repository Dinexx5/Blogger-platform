import { Body, Controller, Param, Put, Res, UseGuards } from '@nestjs/common';
import { BansUserCommand } from './application/use-cases/ban.user.use.case.';
import { AuthGuard } from '../auth/guards/auth.guard';
import { BanModel, UserParamModel } from '../users/userModels';
import { Response } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { isUserIdIntegerGuard } from '../auth/guards/param.integer.guard';

@Controller('sa/users')
export class BansController {
  constructor(private commandBus: CommandBus) {}
  @UseGuards(AuthGuard, isUserIdIntegerGuard)
  @Put(':userId/ban')
  async banUser(
    @Param() param: UserParamModel,
    @Body() inputModel: BanModel,
    @Res() res: Response,
  ) {
    await this.commandBus.execute(new BansUserCommand(param.userId, inputModel));
    return res.sendStatus(204);
  }
}
