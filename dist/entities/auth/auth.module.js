"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const access_jwt_strategy_1 = require("./strategies/access.jwt.strategy");
const local_strategy_1 = require("./strategies/local.strategy");
const users_module_1 = require("../users/users.module");
const auth_service_1 = require("./auth-service");
const email_adapter_1 = require("../../adapters/email.adapter");
const refresh_jwt_strategy_1 = require("./strategies/refresh.jwt.strategy");
const devices_module_1 = require("../devices/devices.module");
const auth_controller_1 = require("./auth.controller");
const attempts_module_1 = require("../attempts/attempts.module");
const token_module_1 = require("../tokens/token.module");
const bans_repository_1 = require("../bans/bans.repository");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/domain/user.entity");
const emailConfirmation_entity_1 = require("../users/domain/emailConfirmation.entity");
const passwordRecovery_entity_1 = require("../users/domain/passwordRecovery.entity");
const banInfo_entity_1 = require("../users/domain/banInfo.entity");
const token_entity_1 = require("../tokens/domain/token.entity");
const device_entity_1 = require("../devices/domain/device.entity");
const saUserBan_entity_1 = require("../bans/domain/saUserBan.entity");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                emailConfirmation_entity_1.EmailConfirmationInfo,
                passwordRecovery_entity_1.PasswordRecoveryInfo,
                banInfo_entity_1.UserBanInfo,
                token_entity_1.Token,
                device_entity_1.Device,
                saUserBan_entity_1.SaUserBan,
            ]),
            users_module_1.UsersModule,
            passport_1.PassportModule,
            devices_module_1.DevicesModule,
            attempts_module_1.AttemptsModule,
            token_module_1.TokensModule,
            jwt_1.JwtModule.register({}),
        ],
        providers: [
            auth_service_1.AuthService,
            local_strategy_1.LocalStrategy,
            access_jwt_strategy_1.AccessJwtStrategy,
            refresh_jwt_strategy_1.RefreshJwtStrategy,
            email_adapter_1.EmailAdapter,
            bans_repository_1.BansRepository,
        ],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService, email_adapter_1.EmailAdapter],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map