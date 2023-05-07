"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const exceptions_filter_1 = require("./shared/exceptions/exceptions.filter");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const class_validator_1 = require("class-validator");
const badrequest_pipe_1 = require("./shared/pipes/badrequest.pipe");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, cookie_parser_1.default)());
    app.enableCors({});
    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(badrequest_pipe_1.validationPipeBadRequest);
    app.useGlobalFilters(new exceptions_filter_1.HttpExceptionFilter());
    await app.listen(3001);
    console.log('Successfully running');
}
bootstrap();
//# sourceMappingURL=main.js.map