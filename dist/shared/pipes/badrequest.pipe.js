"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationPipeBadRequest = void 0;
const common_1 = require("@nestjs/common");
exports.validationPipeBadRequest = new common_1.ValidationPipe({
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
});
//# sourceMappingURL=badrequest.pipe.js.map