import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/exceptions/exceptions.filter';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { validationPipeBadRequest } from './shared/pipes/badrequest.pipe';
import { TelegramAdapter } from './adapters/telegram.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({});
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(validationPipeBadRequest);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3001);
  const telegramAdapter = await app.resolve<TelegramAdapter>(TelegramAdapter);
  await telegramAdapter.sendTelegramWebhook();
  console.log('Successfully running');
}
bootstrap();
