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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth-service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const local_auth_guard_1 = require("./guards/local-auth.guard");
const users_repository_1 = require("../users/users.repository");
const userModels_1 = require("../users/userModels");
const jwt_refresh_guard_1 = require("./guards/jwt-refresh.guard");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
let AuthController = class AuthController {
    constructor(authService, usersRepository) {
        this.authService = authService;
        this.usersRepository = usersRepository;
    }
    async login(req, userId, res) {
        const ip = req.ip;
        const deviceName = req.headers['user-agent'];
        const accessToken = await this.authService.createJwtAccessToken(userId);
        const refreshToken = await this.authService.generateJwtRefreshToken(userId, deviceName, ip);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
        });
        res.status(200).json({ accessToken: accessToken });
    }
    async getProfile(userId, res) {
        const user = await this.usersRepository.findUserById(userId);
        res.send({
            email: user.email,
            login: user.login,
            userId: userId.toString(),
        });
    }
    async getRefreshToken(userTokenMeta, res) {
        const { deviceId, exp } = userTokenMeta;
        const userId = userTokenMeta.userId;
        const newAccessToken = await this.authService.createJwtAccessToken(userId);
        const newRefreshToken = await this.authService.updateJwtRefreshToken(deviceId, exp, userId);
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
        });
        res.status(200).json({ accessToken: newAccessToken });
    }
    async deleteCurrentSession(user, res) {
        const refreshToken = user.refreshToken;
        await this.authService.deleteCurrentToken(refreshToken);
        await this.authService.deleteDeviceForLogout(refreshToken);
        return res.sendStatus(204);
    }
    async registerUser(inputModel, res) {
        const createdAccount = await this.authService.createUser(inputModel);
        if (!createdAccount)
            return res.send('can not send email. try later');
        return res.sendStatus(204);
    }
    async resendEmail(inputModel, res) {
        const isEmailResent = await this.authService.resendEmail(inputModel.email);
        if (!isEmailResent)
            return res.send('Can not send an email');
        return res.sendStatus(204);
    }
    async confirmEmail(inputModel, res) {
        const isConfirmed = await this.authService.confirmEmail(inputModel.code);
        if (!isConfirmed)
            return res.sendStatus(400);
        return res.sendStatus(204);
    }
    async recoverPassword(inputModel, res) {
        const isEmailSent = await this.authService.sendEmailForPasswordRecovery(inputModel.email);
        if (!isEmailSent)
            return res.status(204).send('something went wrong');
        return res.sendStatus(204);
    }
    async newPassword(inputModel, res) {
        const isPasswordUpdated = await this.authService.updatePassword(inputModel);
        if (!isPasswordUpdated)
            return res.send('something went wrong');
        return res.sendStatus(204);
    }
};
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_refresh_guard_1.JwtRefreshAuthGuard),
    (0, common_1.Post)('refresh-token'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getRefreshToken", null);
__decorate([
    (0, common_1.UseGuards)(jwt_refresh_guard_1.JwtRefreshAuthGuard),
    (0, common_1.Post)('logout'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteCurrentSession", null);
__decorate([
    (0, common_1.Post)('registration'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userModels_1.CreateUserModel, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Post)('registration-email-resending'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userModels_1.ResendEmailModel, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendEmail", null);
__decorate([
    (0, common_1.Post)('registration-confirmation'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userModels_1.ConfirmEmailModel, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmEmail", null);
__decorate([
    (0, common_1.Post)('password-recovery'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userModels_1.PasswordRecoveryModel, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "recoverPassword", null);
__decorate([
    (0, common_1.Post)('new-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userModels_1.NewPasswordModel, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "newPassword", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_repository_1.UsersRepository])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map