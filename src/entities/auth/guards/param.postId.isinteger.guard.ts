import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class isPostIdIntegerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const postId = request.params.postId;
    const checkId = Number(postId);
    if (isNaN(checkId)) throw new NotFoundException();
    return true;
  }
}
