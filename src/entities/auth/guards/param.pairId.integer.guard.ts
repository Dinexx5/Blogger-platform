import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class isPairIdIntegerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const pairId = request.params.pairId;
    const checkId = Number(pairId);
    if (isNaN(checkId))
      throw new BadRequestException([
        {
          message: 'invalidId',
          field: 'pairId',
        },
      ]);
    return true;
  }
}
