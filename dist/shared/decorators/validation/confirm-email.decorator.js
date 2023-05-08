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
exports.IsConfirmationCodeValid = exports.IsConfirmationCodeCorrect = void 0;
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const emailConfirmation_entity_1 = require("../../../entities/users/domain/emailConfirmation.entity");
const typeorm_2 = require("typeorm");
let IsConfirmationCodeCorrect = class IsConfirmationCodeCorrect {
    constructor(emailConfirmationRepository) {
        this.emailConfirmationRepository = emailConfirmationRepository;
    }
    async validate(code, args) {
        const confirmationInfo = await this.emailConfirmationRepository.findOneBy({
            confirmationCode: code,
        });
        if (!confirmationInfo) {
            return false;
        }
        if (confirmationInfo.isConfirmed) {
            return false;
        }
        if (confirmationInfo.confirmationCode !== code) {
            return false;
        }
        if (confirmationInfo.expirationDate < new Date()) {
            return false;
        }
        return true;
    }
    defaultMessage(args) {
        return `confirmation code expired, incorrect or email is already confirmed`;
    }
};
IsConfirmationCodeCorrect = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'confirmationCode', async: true }),
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(emailConfirmation_entity_1.EmailConfirmationInfo)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IsConfirmationCodeCorrect);
exports.IsConfirmationCodeCorrect = IsConfirmationCodeCorrect;
function IsConfirmationCodeValid(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'confirmationCode',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsConfirmationCodeCorrect,
        });
    };
}
exports.IsConfirmationCodeValid = IsConfirmationCodeValid;
//# sourceMappingURL=confirm-email.decorator.js.map