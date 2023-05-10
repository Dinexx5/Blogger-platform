"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = exports.localDbRootOptions = exports.cloudDbRootOptions = void 0;
const config_1 = require("@nestjs/config");
const configModule = config_1.ConfigModule.forRoot({ isGlobal: true });
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./entities/users/users.module");
const auth_module_1 = require("./entities/auth/auth.module");
const blogs_module_1 = require("./entities/blogs/blogs.module");
const posts_module_1 = require("./entities/posts/posts.module");
const comments_module_1 = require("./entities/comments/comments.module");
const testing_module_1 = require("./entities/testing/testing.module");
const bans_module_1 = require("./entities/bans/bans.module");
const typeorm_1 = require("@nestjs/typeorm");
const questions_module_1 = require("./entities/quiz/questions.module");
exports.cloudDbRootOptions = {
    type: 'postgres',
    host: process.env.SQL_HOST_NAME,
    port: 5432,
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASS,
    database: process.env.SQL_USERNAME,
    autoLoadEntities: true,
    synchronize: true,
};
exports.localDbRootOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5000,
    username: process.env.SQL_USERNAME,
    password: 'privetOLEG',
    database: 'typeORMdb',
    autoLoadEntities: true,
    synchronize: true,
};
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            configModule,
            typeorm_1.TypeOrmModule.forRoot(exports.localDbRootOptions),
            bans_module_1.BansModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            blogs_module_1.BlogsModule,
            posts_module_1.PostsModule,
            comments_module_1.CommentsModule,
            testing_module_1.TestingModule,
            questions_module_1.QuestionsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map