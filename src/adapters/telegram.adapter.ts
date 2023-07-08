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
      url: `https://blogger-platform-typeorm.onrender.com/integrations/telegram/webhook`,
    });
  }
  async sendMessage(text: string, recipientId: number) {
    this.axiosInstance.interceptors.response.use((request) => {
      return request;
    });
    await this.axiosInstance.post(`sendMessage`, {
      chat_id: recipientId,
      text: text,
    });
  }
  async sendNotificationMessage(blogName: string, tgId: number) {
    await this.axiosInstance.post(`sendMessage`, {
      chat_id: tgId,
      text: `New post published for blog ${blogName}`,
    });
  }
}
