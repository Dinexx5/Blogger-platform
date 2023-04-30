import { Module } from '@nestjs/common';
import { AttemptsRepository } from './attempts.repository';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attempt } from './domain/attempt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attempt])],
  providers: [AttemptsRepository, RateLimitGuard],
  exports: [AttemptsRepository, RateLimitGuard],
})
export class AttemptsModule {}
