import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { subSeconds } from 'date-fns';
import { TooManyRequestsException } from '../../../shared/exceptions/tooManyRequestsExceptions';
import { AttemptsRepository } from '../../attempts/attempts.repository';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private attemptsRepository: AttemptsRepository) {}
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const { ip, url } = request;
    const requestData = ip + url;
    console.log(requestData);
    const dateNow = new Date().toISOString();
    await this.attemptsRepository.addNewAttempt(requestData, dateNow);
    const tenSecondsAgo = subSeconds(new Date(dateNow), 10).toISOString();
    const requestsCount = await this.attemptsRepository.countAttempts(requestData, tenSecondsAgo);
    if (requestsCount > 5) {
      throw new TooManyRequestsException();
    }
    return true;
  }
}
