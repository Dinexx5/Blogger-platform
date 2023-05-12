import { Body, Controller, HttpCode, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import { BansUserCommand } from './application/use-cases/ban.user.use.case.';
import { AuthGuard } from '../auth/guards/auth.guard';
import { BanModel, UserParamModel } from '../users/user.models';
import { CommandBus } from '@nestjs/cqrs';
import { isUserIdIntegerGuard } from '../auth/guards/param.integer.guard';

@Controller('sa/users')
export class BansController {
  constructor(private commandBus: CommandBus) {}
  @UseGuards(AuthGuard, isUserIdIntegerGuard)
  @Put(':userId/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  async banUser(@Param() param: UserParamModel, @Body() inputModel: BanModel) {
    await this.commandBus.execute(new BansUserCommand(param.userId, inputModel));
  }
}
