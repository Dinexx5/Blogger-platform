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
exports.EmailConfirmationInfo = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let EmailConfirmationInfo = class EmailConfirmationInfo {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EmailConfirmationInfo.prototype, "confirmationCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], EmailConfirmationInfo.prototype, "expirationDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], EmailConfirmationInfo.prototype, "isConfirmed", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], EmailConfirmationInfo.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], EmailConfirmationInfo.prototype, "userId", void 0);
EmailConfirmationInfo = __decorate([
    (0, typeorm_1.Entity)()
], EmailConfirmationInfo);
exports.EmailConfirmationInfo = EmailConfirmationInfo;
//# sourceMappingURL=emailConfirmation.entity.js.map