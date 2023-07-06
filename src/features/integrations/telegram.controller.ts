import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { GetTgAuthLinkCommand } from './application/use-cases/get-tg-auth-link.use-case';
import { TelegramService } from './application/telegram-service';

@Controller('integrations/telegram')
export class TelegramController {
  constructor(private commandBus: CommandBus, private telegramService: TelegramService) {}
  @Post('webhook')
  @HttpCode(HttpStatus.NO_CONTENT)
  async telegramWebhook(@Body() payload: any) {
    await this.telegramService.handleIncomingMessage(payload);
  }
  @UseGuards(JwtAccessAuthGuard)
  @Get('auth-bot-link')
  async getAuthLink(@CurrentUser() userId) {
    return await this.commandBus.execute(new GetTgAuthLinkCommand(userId));
  }
}
