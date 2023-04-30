import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class isCommentIdIntegerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const commentId = request.params.commentId;
    const checkId = Number(commentId);
    if (isNaN(checkId)) throw new NotFoundException();
    return true;
  }
}
