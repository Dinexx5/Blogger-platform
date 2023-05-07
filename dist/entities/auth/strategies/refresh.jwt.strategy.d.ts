import { Request } from 'express';
import { Token } from '../../tokens/domain/token.entity';
import { Repository } from 'typeorm';
declare const RefreshJwtStrategy_base: new (...args: any[]) => any;
export declare class RefreshJwtStrategy extends RefreshJwtStrategy_base {
    private readonly tokenRepository;
    constructor(tokenRepository: Repository<Token>);
    validate(req: Request, payload: any): Promise<{
        userId: number;
        deviceId: any;
        exp: any;
        refreshToken: any;
    }>;
}
export {};
