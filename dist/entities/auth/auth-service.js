"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const devices_service_1 = require("../devices/devices.service");
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const email_adapter_1 = require("../../adapters/email.adapter");
const bcrypt = __importStar(require("bcrypt"));
const bans_repository_1 = require("../bans/bans.repository");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/domain/user.entity");
const typeorm_2 = require("@nestjs/typeorm");
const banInfo_entity_1 = require("../users/domain/banInfo.entity");
const emailConfirmation_entity_1 = require("../users/domain/emailConfirmation.entity");
const passwordRecovery_entity_1 = require("../users/domain/passwordRecovery.entity");
const users_repository_1 = require("../users/users.repository");
const token_entity_1 = require("../tokens/domain/token.entity");
let AuthService = class AuthService {
    constructor(usersTypeOrmRepository, banInfoRepository, emailConfirmationRepository, passwordRecoveryRepository, tokenRepository, jwtService, emailAdapter, usersService, devicesService, bansRepository, usersRepository) {
        this.usersTypeOrmRepository = usersTypeOrmRepository;
        this.banInfoRepository = banInfoRepository;
        this.emailConfirmationRepository = emailConfirmationRepository;
        this.passwordRecoveryRepository = passwordRecoveryRepository;
        this.tokenRepository = tokenRepository;
        this.jwtService = jwtService;
        this.emailAdapter = emailAdapter;
        this.usersService = usersService;
        this.devicesService = devicesService;
        this.bansRepository = bansRepository;
        this.usersRepository = usersRepository;
    }
    async validateUser(username, password) {
        const user = await this.usersRepository.findUserByLoginOrEmail(username);
        if (!user)
            return null;
        const isConfirmed = await this.usersService.checkConfirmation(user.id);
        if (!isConfirmed)
            return null;
        const isBanned = await this.bansRepository.isUserBanned(user.id);
        if (isBanned)
            return null;
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword)
            return null;
        return user.id;
    }
    async createJwtAccessToken(userId) {
        const payload = { userId: userId };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.ACCESS_SECRET,
            expiresIn: '10000s',
        });
        return accessToken;
    }
    async generateJwtRefreshToken(userId, deviceName, ip) {
        const deviceId = new Date().toISOString();
        const payload = { userId: userId, deviceId: deviceId };
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.REFRESH_SECRET,
            expiresIn: '20000s',
        });
        const result = await this.jwtService.verify(refreshToken, {
            secret: process.env.REFRESH_SECRET,
        });
        const issuedAt = new Date(result.iat * 1000).toISOString();
        const expiredAt = new Date(result.exp * 1000).toISOString();
        const token = await this.tokenRepository.create();
        token.issuedAt = issuedAt;
        token.userId = userId;
        token.deviceId = deviceId;
        token.deviceName = deviceName;
        token.ip = ip;
        token.expiredAt = expiredAt;
        await this.tokenRepository.save(token);
        await this.devicesService.createDevice(userId, ip, deviceName, deviceId, issuedAt);
        return refreshToken;
    }
    async updateJwtRefreshToken(deviceId, exp, userId) {
        const previousExpirationDate = new Date(exp * 1000).toISOString();
        const newPayload = { userId: userId, deviceId: deviceId };
        const newRefreshToken = this.jwtService.sign(newPayload, {
            secret: process.env.REFRESH_SECRET,
            expiresIn: '20000s',
        });
        const newResult = await this.getRefreshTokenInfo(newRefreshToken);
        const newIssuedAt = new Date(newResult.iat * 1000).toISOString();
        const newExpiredAt = new Date(newResult.exp * 1000).toISOString();
        const token = await this.tokenRepository.findOneBy({ expiredAt: previousExpirationDate });
        token.issuedAt = newIssuedAt;
        token.expiredAt = newExpiredAt;
        await this.tokenRepository.save(token);
        await this.devicesService.updateLastActiveDate(deviceId, newIssuedAt);
        return newRefreshToken;
    }
    async getRefreshTokenInfo(token) {
        try {
            const result = this.jwtService.verify(token, { secret: process.env.REFRESH_SECRET });
            return result;
        }
        catch (error) {
            return null;
        }
    }
    async getAccessTokenInfo(token) {
        try {
            const result = this.jwtService.verify(token, { secret: process.env.ACCESS_SECRET });
            return result;
        }
        catch (error) {
            return null;
        }
    }
    async deleteCurrentToken(token) {
        const result = await this.getRefreshTokenInfo(token);
        if (!result)
            throw new common_1.UnauthorizedException();
        const expirationDate = new Date(result.exp * 1000).toISOString();
        const foundToken = await this.tokenRepository.findOneBy({
            expiredAt: expirationDate,
        });
        if (!foundToken)
            throw new common_1.UnauthorizedException();
        await this.tokenRepository.remove(foundToken);
    }
    async deleteDeviceForLogout(token) {
        const result = await this.getRefreshTokenInfo(token);
        const deviceId = result.deviceId;
        await this.devicesService.deleteDevice(deviceId);
    }
    async createUser(inputModel) {
        const passwordHash = await this.usersService.generateHash(inputModel.password);
        const expirationDate = (0, date_fns_1.addDays)(new Date(), 1);
        const confirmationCode = (0, uuid_1.v4)();
        const isConfirmed = false;
        const createdAt = new Date().toISOString();
        const user = await this.usersTypeOrmRepository.create();
        user.login = inputModel.login;
        user.email = inputModel.email;
        user.passwordHash = passwordHash;
        user.createdAt = createdAt;
        await this.usersTypeOrmRepository.save(user);
        const banInfo = await this.banInfoRepository.create();
        banInfo.userId = user.id;
        banInfo.isBanned = false;
        banInfo.banDate = null;
        banInfo.banReason = null;
        await this.banInfoRepository.save(banInfo);
        const emailConfirmationInfo = await this.emailConfirmationRepository.create();
        emailConfirmationInfo.userId = user.id;
        emailConfirmationInfo.confirmationCode = confirmationCode;
        emailConfirmationInfo.isConfirmed = isConfirmed;
        emailConfirmationInfo.expirationDate = expirationDate;
        await this.emailConfirmationRepository.save(emailConfirmationInfo);
        const passwordRecoveryInfo = await this.passwordRecoveryRepository.create();
        passwordRecoveryInfo.userId = user.id;
        passwordRecoveryInfo.expirationDate = null;
        passwordRecoveryInfo.recoveryCode = null;
        await this.passwordRecoveryRepository.save(passwordRecoveryInfo);
        if (!user) {
            return null;
        }
        try {
            await this.emailAdapter.sendEmailForConfirmation(inputModel.email, confirmationCode);
        }
        catch (error) {
            return null;
        }
        return user;
    }
    async resendEmail(email) {
        const confirmationCode = (0, uuid_1.v4)();
        try {
            await this.emailAdapter.sendEmailForConfirmation(email, confirmationCode);
        }
        catch (error) {
            console.error(error);
            return false;
        }
        const isUpdated = await this.usersService.updateConfirmationCode(confirmationCode);
        if (!isUpdated)
            return false;
        return true;
    }
    async confirmEmail(code) {
        const isConfirmed = await this.usersService.updateConfirmation(code);
        if (!isConfirmed)
            return false;
        return true;
    }
    async sendEmailForPasswordRecovery(email) {
        const confirmationCode = (0, uuid_1.v4)();
        const isUpdated = await this.usersService.updateRecoveryCode(email, confirmationCode);
        if (!isUpdated)
            return false;
        try {
            await this.emailAdapter.sendEmailForPasswordRecovery(email, confirmationCode);
        }
        catch (error) {
            console.error(error);
            return false;
        }
        return true;
    }
    async updatePassword(inputModel) {
        const isUpdated = await this.usersService.updatePassword(inputModel);
        if (!isUpdated)
            return false;
        return true;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_2.InjectRepository)(banInfo_entity_1.UserBanInfo)),
    __param(2, (0, typeorm_2.InjectRepository)(emailConfirmation_entity_1.EmailConfirmationInfo)),
    __param(3, (0, typeorm_2.InjectRepository)(passwordRecovery_entity_1.PasswordRecoveryInfo)),
    __param(4, (0, typeorm_2.InjectRepository)(token_entity_1.Token)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        jwt_1.JwtService,
        email_adapter_1.EmailAdapter,
        users_service_1.UsersService,
        devices_service_1.DevicesService,
        bans_repository_1.BansRepository,
        users_repository_1.UsersRepository])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth-service.js.map