"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BansModule = void 0;
const common_1 = require("@nestjs/common");
const ban_user_use_case_1 = require("./application/use-cases/ban.user.use.case.");
const bans_repository_1 = require("../bans/bans.repository");
const bans_controller_1 = require("./bans.controller");
const users_module_1 = require("../users/users.module");
const auth_module_1 = require("../auth/auth.module");
const blogs_module_1 = require("../blogs/blogs.module");
const token_module_1 = require("../tokens/token.module");
const devices_module_1 = require("../devices/devices.module");
const posts_module_1 = require("../posts/posts.module");
const comments_module_1 = require("../comments/comments.module");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const saUserBan_entity_1 = require("./domain/saUserBan.entity");
const banInfo_entity_1 = require("../users/domain/banInfo.entity");
const saBlogBan_entity_1 = require("./domain/saBlogBan.entity");
const token_entity_1 = require("../tokens/domain/token.entity");
const device_entity_1 = require("../devices/domain/device.entity");
let BansModule = class BansModule {
};
BansModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([saUserBan_entity_1.SaUserBan, banInfo_entity_1.UserBanInfo, saBlogBan_entity_1.SaBlogBan, token_entity_1.Token, device_entity_1.Device]),
            cqrs_1.CqrsModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            blogs_module_1.BlogsModule,
            posts_module_1.PostsModule,
            comments_module_1.CommentsModule,
            token_module_1.TokensModule,
            devices_module_1.DevicesModule,
        ],
        providers: [ban_user_use_case_1.BansUserUseCase, bans_repository_1.BansRepository],
        controllers: [bans_controller_1.BansController],
        exports: [ban_user_use_case_1.BansUserUseCase, bans_repository_1.BansRepository],
    })
], BansModule);
exports.BansModule = BansModule;
//# sourceMappingURL=bans.module.js.map