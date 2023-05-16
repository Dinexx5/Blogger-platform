import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PairGame } from './domain/pair-game.entity';
import { PairGameController } from './pair-game.controller';
import { PairGameService } from './pair-game.service';
import { UsersRepository } from '../users/users.repository';
import { Question } from './domain/question.entity';
import { User } from '../users/domain/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PairGame, Question, User])],
  providers: [PairGameService, UsersRepository],
  controllers: [PairGameController],
  exports: [],
})
export class PairGameModule {}
