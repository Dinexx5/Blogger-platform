import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { QuestionsQueryRepository } from './questions.query.repo';
import { Question } from './domain/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  providers: [QuestionsService, QuestionsQueryRepository],
  controllers: [QuestionsController],
  exports: [],
})
export class QuestionsModule {}
