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
exports.UsersSAController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
const userModels_1 = require("./userModels");
const sa_users_query_repo_1 = require("./sa.users.query-repo");
let UsersSAController = class UsersSAController {
    constructor(usersService, saUsersQueryRepository) {
        this.usersService = usersService;
        this.saUsersQueryRepository = saUsersQueryRepository;
    }
    async getUsers(paginationQuerysSA) {
        const returnedUsers = await this.saUsersQueryRepository.getAllUsers(paginationQuerysSA);
        return returnedUsers;
    }
    async createUser(inputModel) {
        const createdUser = await this.usersService.createUser(inputModel);
        return createdUser;
    }
    async deleteUser(id, res) {
        const isDeleted = await this.usersService.deleteUserById(id);
        if (!isDeleted) {
            return res.sendStatus(404);
        }
        return res.sendStatus(204);
    }
};
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersSAController.prototype, "getUsers", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userModels_1.CreateUserModel]),
    __metadata("design:returntype", Promise)
], UsersSAController.prototype, "createUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Delete)(':userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UsersSAController.prototype, "deleteUser", null);
UsersSAController = __decorate([
    (0, common_1.Controller)('sa/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        sa_users_query_repo_1.SaUsersQueryRepository])
], UsersSAController);
exports.UsersSAController = UsersSAController;
//# sourceMappingURL=sa.users.controller.js.map