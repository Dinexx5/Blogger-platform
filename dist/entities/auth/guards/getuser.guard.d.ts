import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth-service';
export interface CustomRequest extends Request {
    user: string;
}
export declare class GetUserGuard implements CanActivate {
    private authService;
    constructor(authService: AuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
