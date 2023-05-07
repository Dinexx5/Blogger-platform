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
exports.UserBanInfo = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let UserBanInfo = class UserBanInfo {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], UserBanInfo.prototype, "isBanned", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserBanInfo.prototype, "banDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserBanInfo.prototype, "banReason", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], UserBanInfo.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], UserBanInfo.prototype, "userId", void 0);
UserBanInfo = __decorate([
    (0, typeorm_1.Entity)()
], UserBanInfo);
exports.UserBanInfo = UserBanInfo;
//# sourceMappingURL=banInfo.entity.js.map