import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const loginPass = request.headers.authorization;
    if (loginPass === 'Basic YWRtaW46cXdlcnR5') {
      return true;
    }
    throw new UnauthorizedException();
  }
}
