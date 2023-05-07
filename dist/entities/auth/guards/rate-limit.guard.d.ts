import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AttemptsRepository } from '../../attempts/attempts.repository';
export declare class RateLimitGuard implements CanActivate {
    private attemptsRepository;
    constructor(attemptsRepository: AttemptsRepository);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
