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
exports.IsRecoveryCodeValid = exports.IsRecoveryCodeCorrect = void 0;
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const passwordRecovery_entity_1 = require("../../../entities/users/domain/passwordRecovery.entity");
let IsRecoveryCodeCorrect = class IsRecoveryCodeCorrect {
    constructor(passwordRecoveryRepository) {
        this.passwordRecoveryRepository = passwordRecoveryRepository;
    }
    async validate(code, args) {
        const recoveryInfo = await this.passwordRecoveryRepository.findOneBy({ recoveryCode: code });
        if (!recoveryInfo) {
            return false;
        }
        if (!recoveryInfo.expirationDate) {
            return false;
        }
        if (recoveryInfo.recoveryCode !== code) {
            return false;
        }
        if (recoveryInfo.expirationDate < new Date()) {
            return false;
        }
        return true;
    }
    defaultMessage(args) {
        return `confirmation code expired, incorrect or email is already confirmed`;
    }
};
IsRecoveryCodeCorrect = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'recoveryCode', async: true }),
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(passwordRecovery_entity_1.PasswordRecoveryInfo)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IsRecoveryCodeCorrect);
exports.IsRecoveryCodeCorrect = IsRecoveryCodeCorrect;
function IsRecoveryCodeValid(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'recoveryCode',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsRecoveryCodeCorrect,
        });
    };
}
exports.IsRecoveryCodeValid = IsRecoveryCodeValid;
//# sourceMappingURL=password-recovery.decorator.js.map