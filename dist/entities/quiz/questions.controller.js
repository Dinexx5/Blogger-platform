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
exports.QuestionsController = void 0;
const common_1 = require("@nestjs/common");
const questions_service_1 = require("./questions.service");
const question_models_1 = require("./question.models");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const questions_query_repo_1 = require("./questions.query.repo");
let QuestionsController = class QuestionsController {
    constructor(questionService, questionsQueryRepo) {
        this.questionService = questionService;
        this.questionsQueryRepo = questionsQueryRepo;
    }
    async getQuestions(query) {
        return this.questionsQueryRepo.getQuestions(query);
    }
    async createQuestion(questionData) {
        return this.questionService.createQuestion(questionData);
    }
    async updateQuestion(id, questionData) {
        await this.questionService.updateQuestion(id, questionData);
    }
    async delete(id) {
        await this.questionService.deleteQuestion(id);
    }
    async updatePublishedStatus(id, updateModel) {
        await this.questionService.updatePublishedStatus(id, updateModel.published);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [question_models_1.GetQuestionsPaginationDto]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "getQuestions", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [question_models_1.createQuestionDto]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "createQuestion", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard),
    (0, common_1.Put)(':questionId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('questionId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, question_models_1.updateQuestionDto]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "updateQuestion", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard),
    (0, common_1.Delete)(':questionId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('questionId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAccessAuthGuard),
    (0, common_1.Put)(':questionId/publish'),
    __param(0, (0, common_1.Param)('questionId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, question_models_1.publishedUpdateModel]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "updatePublishedStatus", null);
QuestionsController = __decorate([
    (0, common_1.Controller)('sa/quiz/questions'),
    __metadata("design:paramtypes", [questions_service_1.QuestionsService,
        questions_query_repo_1.QuestionsQueryRepository])
], QuestionsController);
exports.QuestionsController = QuestionsController;
//# sourceMappingURL=questions.controller.js.map