import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth-service';
export interface CustomRequest extends Request {
  user: string;
}
@Injectable()
export class GetUserGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext) {
    const request: CustomRequest = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      return true;
    }
    const token = request.headers.authorization.split(' ')[1];
    const result = await this.authService.getAccessTokenInfo(token);
    request.user = result.userId;
    return true;
  }
}
