import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/exceptions/exceptions.filter';

export function setupAppForTests(app: INestApplication, globalPrefix: string) {
  app.enableCors({});
  app.use(cookieParser());
  app.setGlobalPrefix(globalPrefix);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const errorsForResponse = [];
        errors.forEach((e) => {
          const keys = Object.keys(e.constraints);
          keys.forEach((key) => {
            errorsForResponse.push({
              message: e.constraints[key],
              field: e.property,
            });
          });
        });
        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  return app;
}
