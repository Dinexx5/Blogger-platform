import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { HandleRegistrationMessageCommand } from './use-cases/handle-registration-message.use-case';

@Injectable()
export class TelegramService {
  constructor(private commandBus: CommandBus) {}

  async handleIncomingMessage(payload: TgMessagePayload) {
    console.log(payload);
    const text = payload.message.text;

    if (text && text.startsWith('/start code=')) {
      const code = text.split('=')[1];
      await this.commandBus.execute(
        new HandleRegistrationMessageCommand(payload.message.from.id, code),
      );
    }
  }
}

export type TgMessagePayload = {
  update_id: number;
  message: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name: string;
      username: string;
      language_code: string;
    };
    chat: {
      id: number;
      first_name: string;
      last_name: string;
      username: string;
      type: string;
    };
    date: number;
    text?: string;
  };
};
