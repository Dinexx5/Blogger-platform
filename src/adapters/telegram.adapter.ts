import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class TelegramAdapter {
  private axiosInstance: AxiosInstance;
  constructor() {
    const token = process.env.TG_TOKEN;
    this.axiosInstance = axios.create({ baseURL: `https://api.telegram.org/bot${token}/` });
  }
  async sendTelegramWebhook() {
    await this.axiosInstance.post(`setWebhook`, {
      url: `/integrations/telegram/webhook`,
    });
  }
  async sendMessage(text: string, recipientId: number) {
    await this.axiosInstance.post(`sendMessage`, {
      chat_id: recipientId,
      text: text,
    });
  }
}
