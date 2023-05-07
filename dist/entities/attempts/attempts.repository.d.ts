import { DataSource, Repository } from 'typeorm';
import { Attempt } from './domain/attempt.entity';
export declare class AttemptsRepository {
    protected dataSource: DataSource;
    private readonly attemptRepository;
    constructor(dataSource: DataSource, attemptRepository: Repository<Attempt>);
    addNewAttempt(requestData: string, date: string): Promise<void>;
    countAttempts(requestData: string, timeTenSecondsAgo: string): Promise<number>;
}
