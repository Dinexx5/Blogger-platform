"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshJwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const typeorm_1 = require("@nestjs/typeorm");
const token_entity_1 = require("../../tokens/domain/token.entity");
const typeorm_2 = require("typeorm");
let RefreshJwtStrategy = class RefreshJwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-refresh') {
    constructor(tokenRepository) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                (req) => {
                    const token = req === null || req === void 0 ? void 0 : req.cookies['refreshToken'];
                    if (!token) {
                        return null;
                    }
                    return token;
                },
            ]),
            secretOrKey: process.env.REFRESH_SECRET,
            passReqToCallback: true,
        });
        this.tokenRepository = tokenRepository;
    }
    async validate(req, payload) {
        const refreshToken = req === null || req === void 0 ? void 0 : req.cookies['refreshToken'];
        if (!refreshToken) {
            throw new common_1.UnauthorizedException();
        }
        const expiredAt = new Date(payload.exp * 1000).toISOString();
        const token = await this.tokenRepository.findOneBy({ expiredAt: expiredAt });
        if (!token) {
            throw new common_1.UnauthorizedException();
        }
        const userId = +payload.userId;
        const deviceId = payload.deviceId;
        const exp = payload.exp;
        return { userId, deviceId, exp, refreshToken };
    }
};
RefreshJwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(token_entity_1.Token)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RefreshJwtStrategy);
exports.RefreshJwtStrategy = RefreshJwtStrategy;
//# sourceMappingURL=refresh.jwt.strategy.js.map