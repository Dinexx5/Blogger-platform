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
exports.BansController = void 0;
const common_1 = require("@nestjs/common");
const ban_user_use_case_1 = require("./application/use-cases/ban.user.use.case.");
const auth_guard_1 = require("../auth/guards/auth.guard");
const userModels_1 = require("../users/userModels");
const cqrs_1 = require("@nestjs/cqrs");
const param_integer_guard_1 = require("../auth/guards/param.integer.guard");
let BansController = class BansController {
    constructor(commandBus) {
        this.commandBus = commandBus;
    }
    async banUser(param, inputModel, res) {
        await this.commandBus.execute(new ban_user_use_case_1.BansUserCommand(param.userId, inputModel));
        return res.sendStatus(204);
    }
};
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, param_integer_guard_1.isUserIdIntegerGuard),
    (0, common_1.Put)(':userId/ban'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userModels_1.UserParamModel,
        userModels_1.BanModel, Object]),
    __metadata("design:returntype", Promise)
], BansController.prototype, "banUser", null);
BansController = __decorate([
    (0, common_1.Controller)('sa/users'),
    __metadata("design:paramtypes", [cqrs_1.CommandBus])
], BansController);
exports.BansController = BansController;
//# sourceMappingURL=bans.controller.js.map