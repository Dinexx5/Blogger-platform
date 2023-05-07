"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAppForTests = void 0;
const common_1 = require("@nestjs/common");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const class_validator_1 = require("class-validator");
const app_module_1 = require("./app.module");
const exceptions_filter_1 = require("./shared/exceptions/exceptions.filter");
function setupAppForTests(app, globalPrefix) {
    app.enableCors({});
    app.use((0, cookie_parser_1.default)());
    app.setGlobalPrefix(globalPrefix);
    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new common_1.ValidationPipe({
        stopAtFirstError: true,
        exceptionFactory: (errors) => {
            const errorsForResponse = [];
            errors.forEach((e) => {
                const keys = Object.keys(e.constraints);
                keys.forEach((key) => {
                    errorsForResponse.push({
                        message: e.constraints[key],
                        field: e.property,
                    });
                });
            });
            throw new common_1.BadRequestException(errorsForResponse);
        },
    }));
    app.useGlobalFilters(new exceptions_filter_1.HttpExceptionFilter());
    return app;
}
exports.setupAppForTests = setupAppForTests;
//# sourceMappingURL=setupAppForTests.js.map