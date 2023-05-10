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
exports.QuestionsQueryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const question_entity_1 = require("./domain/question.entity");
const typeorm_2 = require("typeorm");
let QuestionsQueryRepository = class QuestionsQueryRepository {
    constructor(questionsRepository) {
        this.questionsRepository = questionsRepository;
    }
    async getQuestions(getQuestionsDto) {
        const { searchBodyTerm, publishedStatus = 'all', sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10, } = getQuestionsDto;
        const query = this.questionsRepository.createQueryBuilder('q');
        if (searchBodyTerm) {
            query.andWhere('q.body LIKE :searchBodyTerm', {
                searchBodyTerm: `%${searchBodyTerm}%`,
            });
        }
        if (publishedStatus !== 'all') {
            query.andWhere('q.published = :publishedStatus', {
                publishedStatus: publishedStatus === 'published',
            });
        }
        query.orderBy(`q.${sortBy}`, sortDirection === 'desc' ? 'DESC' : 'ASC');
        const [questions, totalCount] = await query
            .limit(pageSize)
            .offset((pageNumber - 1) * pageSize)
            .getManyAndCount();
        return {
            pagesCount: Math.ceil(totalCount / +pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: questions,
        };
    }
};
QuestionsQueryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], QuestionsQueryRepository);
exports.QuestionsQueryRepository = QuestionsQueryRepository;
//# sourceMappingURL=questions.query.repo.js.map