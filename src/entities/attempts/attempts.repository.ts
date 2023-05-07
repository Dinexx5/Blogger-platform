import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import { Attempt } from './domain/attempt.entity';

@Injectable()
export class AttemptsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Attempt)
    private readonly attemptRepository: Repository<Attempt>,
  ) {}
  async addNewAttempt(requestData: string, date: string) {
    const attempt = await this.attemptRepository.create();
    attempt.requestData = requestData;
    attempt.date = date;
    await this.attemptRepository.save(attempt);
  }
  async countAttempts(requestData: string, timeTenSecondsAgo: string) {
    return await this.attemptRepository.countBy({
      requestData: requestData,
      date: MoreThanOrEqual(timeTenSecondsAgo),
    });
  }
}
