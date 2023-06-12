import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../../tokens/domain/token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req?.cookies['refreshToken'];
          if (!token) {
            return null;
          }
          return token;
        },
      ]),
      secretOrKey: process.env.REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req?.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const expiredAt = new Date(payload.exp * 1000).toISOString();
    const token = await this.tokenRepository.findOneBy({ expiredAt: expiredAt });
    if (!token) {
      throw new UnauthorizedException();
    }
    const userId = +payload.userId;
    const deviceId = payload.deviceId;
    const exp = payload.exp;
    return { userId, deviceId, exp, refreshToken };
  }
}
