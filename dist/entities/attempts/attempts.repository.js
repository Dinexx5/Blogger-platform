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
exports.AttemptsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attempt_entity_1 = require("./domain/attempt.entity");
let AttemptsRepository = class AttemptsRepository {
    constructor(dataSource, attemptRepository) {
        this.dataSource = dataSource;
        this.attemptRepository = attemptRepository;
    }
    async addNewAttempt(requestData, date) {
        const attempt = await this.attemptRepository.create();
        attempt.requestData = requestData;
        attempt.date = date;
        await this.attemptRepository.save(attempt);
    }
    async countAttempts(requestData, timeTenSecondsAgo) {
        return await this.attemptRepository.countBy({
            requestData: requestData,
            date: (0, typeorm_2.MoreThanOrEqual)(timeTenSecondsAgo),
        });
    }
};
AttemptsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __param(1, (0, typeorm_1.InjectRepository)(attempt_entity_1.Attempt)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository])
], AttemptsRepository);
exports.AttemptsRepository = AttemptsRepository;
//# sourceMappingURL=attempts.repository.js.map