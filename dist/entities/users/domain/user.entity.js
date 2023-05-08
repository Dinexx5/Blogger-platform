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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const emailConfirmation_entity_1 = require("./emailConfirmation.entity");
const passwordRecovery_entity_1 = require("./passwordRecovery.entity");
const banInfo_entity_1 = require("./banInfo.entity");
let User = class User {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "login", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => emailConfirmation_entity_1.EmailConfirmationInfo, (eci) => eci.user),
    __metadata("design:type", emailConfirmation_entity_1.EmailConfirmationInfo)
], User.prototype, "emailConfirmationInfo", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => passwordRecovery_entity_1.PasswordRecoveryInfo, (pri) => pri.user),
    __metadata("design:type", passwordRecovery_entity_1.PasswordRecoveryInfo)
], User.prototype, "passwordRecoveryInfo", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => banInfo_entity_1.UserBanInfo, (bi) => bi.user),
    __metadata("design:type", banInfo_entity_1.UserBanInfo)
], User.prototype, "banInfo", void 0);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map