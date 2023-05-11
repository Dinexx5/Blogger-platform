import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class isQuestionIdIntegerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const questionId = request.params.questionId;
    const checkId = Number(questionId);
    if (isNaN(checkId)) throw new NotFoundException();
    return true;
  }
}
