"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsLikeStatusCorrect = exports.IsLikeStatusCorrectDecorator = void 0;
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
let IsLikeStatusCorrectDecorator = class IsLikeStatusCorrectDecorator {
    async validate(likeStatus, args) {
        const correctStatuses = ['None', 'Like', 'Dislike'];
        const isCorrect = correctStatuses.includes(likeStatus);
        if (!isCorrect) {
            return false;
        }
        return true;
    }
    defaultMessage(args) {
        return `Incorrect like status`;
    }
};
IsLikeStatusCorrectDecorator = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsLikeStatusCorrect', async: true }),
    (0, common_1.Injectable)()
], IsLikeStatusCorrectDecorator);
exports.IsLikeStatusCorrectDecorator = IsLikeStatusCorrectDecorator;
function IsLikeStatusCorrect(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'IsLikeStatusCorrect',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsLikeStatusCorrectDecorator,
        });
    };
}
exports.IsLikeStatusCorrect = IsLikeStatusCorrect;
//# sourceMappingURL=like-status.decorator.js.map