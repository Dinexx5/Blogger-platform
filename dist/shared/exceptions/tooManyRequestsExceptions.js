"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooManyRequestsException = void 0;
const http_exception_1 = require("@nestjs/common/exceptions/http.exception");
class TooManyRequestsException extends http_exception_1.HttpException {
    constructor() {
        super({}, 429);
    }
}
exports.TooManyRequestsException = TooManyRequestsException;
//# sourceMappingURL=tooManyRequestsExceptions.js.map