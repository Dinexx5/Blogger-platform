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
exports.RateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const date_fns_1 = require("date-fns");
const tooManyRequestsExceptions_1 = require("../../../shared/exceptions/tooManyRequestsExceptions");
const attempts_repository_1 = require("../../attempts/attempts.repository");
let RateLimitGuard = class RateLimitGuard {
    constructor(attemptsRepository) {
        this.attemptsRepository = attemptsRepository;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { ip, url } = request;
        const requestData = ip + url;
        console.log(requestData);
        const dateNow = new Date().toISOString();
        await this.attemptsRepository.addNewAttempt(requestData, dateNow);
        const tenSecondsAgo = (0, date_fns_1.subSeconds)(new Date(dateNow), 10).toISOString();
        const requestsCount = await this.attemptsRepository.countAttempts(requestData, tenSecondsAgo);
        if (requestsCount > 5) {
            throw new tooManyRequestsExceptions_1.TooManyRequestsException();
        }
        return true;
    }
};
RateLimitGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [attempts_repository_1.AttemptsRepository])
], RateLimitGuard);
exports.RateLimitGuard = RateLimitGuard;
//# sourceMappingURL=rate-limit.guard.js.map