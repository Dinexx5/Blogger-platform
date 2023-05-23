import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PairGame } from './domain/pair-game.entity';
import { PairGameController } from './pair-game.controller';
import { PairGameService } from './pair-game.service';
import { UsersRepository } from '../users/users.repository';
import { Question } from './domain/question.entity';
import { User } from '../users/domain/user.entity';
import { PairGameQueryRepository } from './pair-game.query.repository';
import { PairGameUsersController } from './pair-game.users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PairGame, Question, User])],
  providers: [PairGameService, UsersRepository, PairGameQueryRepository],
  controllers: [PairGameController, PairGameUsersController],
  exports: [],
})
export class PairGameModule {}
