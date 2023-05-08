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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("./users.repository");
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const bcrypt = __importStar(require("bcrypt"));
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./domain/user.entity");
const typeorm_2 = require("typeorm");
const banInfo_entity_1 = require("./domain/banInfo.entity");
const emailConfirmation_entity_1 = require("./domain/emailConfirmation.entity");
const passwordRecovery_entity_1 = require("./domain/passwordRecovery.entity");
let UsersService = class UsersService {
    constructor(usersTypeOrmRepository, banInfoRepository, emailConfirmationRepository, passwordRecoveryRepository, usersRepository) {
        this.usersTypeOrmRepository = usersTypeOrmRepository;
        this.banInfoRepository = banInfoRepository;
        this.emailConfirmationRepository = emailConfirmationRepository;
        this.passwordRecoveryRepository = passwordRecoveryRepository;
        this.usersRepository = usersRepository;
    }
    async createUser(inputModel) {
        const passwordHash = await this.generateHash(inputModel.password);
        const expirationDate = (0, date_fns_1.addDays)(new Date(), 1);
        const confirmationCode = (0, uuid_1.v4)();
        const isConfirmed = true;
        const createdAt = new Date().toISOString();
        const user = await this.usersTypeOrmRepository.create();
        user.login = inputModel.login;
        user.email = inputModel.email;
        user.passwordHash = passwordHash;
        user.createdAt = createdAt;
        await this.usersRepository.save(user);
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
        return {
            id: user.id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
            banInfo: {
                isBanned: false,
                banDate: null,
                banReason: null,
            },
        };
    }
    async deleteUserById(userId) {
        const user = await this.usersRepository.findUserById(userId);
        if (!user)
            return false;
        await this.passwordRecoveryRepository.delete({ userId: userId });
        await this.emailConfirmationRepository.delete({ userId: userId });
        await this.banInfoRepository.delete({ userId: userId });
        await this.usersTypeOrmRepository.remove(user);
        return true;
    }
    async checkConfirmation(userId) {
        const confirmationInfo = await this.emailConfirmationRepository.findOneBy({ userId: userId });
        return confirmationInfo.isConfirmed;
    }
    async generateHash(password) {
        const passwordSalt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, passwordSalt);
    }
    async updateConfirmationCode(confirmationCode) {
        const confirmationInfo = await this.emailConfirmationRepository.findOneBy({
            confirmationCode: confirmationCode,
        });
        if (!confirmationInfo)
            return false;
        confirmationInfo.confirmationCode = confirmationCode;
        await this.emailConfirmationRepository.save(confirmationInfo);
        return true;
    }
    async updateConfirmation(confirmationCode) {
        const confirmationInfo = await this.emailConfirmationRepository.findOneBy({
            confirmationCode: confirmationCode,
        });
        if (!confirmationInfo)
            return false;
        confirmationInfo.isConfirmed = true;
        await this.emailConfirmationRepository.save(confirmationInfo);
        return true;
    }
    async updateRecoveryCode(email, recoveryCode) {
        const user = await this.usersRepository.findUserByLoginOrEmail(email);
        if (!user)
            return false;
        const expirationDate = (0, date_fns_1.add)(new Date(), { hours: 1 });
        const recoveryInfo = await this.passwordRecoveryRepository.findOneBy({
            recoveryCode: recoveryCode,
        });
        recoveryInfo.recoveryCode = recoveryCode;
        recoveryInfo.expirationDate = expirationDate;
        await this.passwordRecoveryRepository.save(recoveryInfo);
        return true;
    }
    async updatePassword(inputModel) {
        const recoveryInfo = await this.passwordRecoveryRepository.findOneBy({
            recoveryCode: inputModel.recoveryCode,
        });
        if (!recoveryInfo)
            return false;
        const newPasswordHash = await this.generateHash(inputModel.newPassword);
        const user = await this.usersRepository.findUserById(recoveryInfo.userId);
        user.passwordHash = newPasswordHash;
        await this.usersRepository.save(user);
        return true;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(banInfo_entity_1.UserBanInfo)),
    __param(2, (0, typeorm_1.InjectRepository)(emailConfirmation_entity_1.EmailConfirmationInfo)),
    __param(3, (0, typeorm_1.InjectRepository)(passwordRecovery_entity_1.PasswordRecoveryInfo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        users_repository_1.UsersRepository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map