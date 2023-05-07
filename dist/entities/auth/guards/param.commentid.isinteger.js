"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCommentIdIntegerGuard = void 0;
const common_1 = require("@nestjs/common");
let isCommentIdIntegerGuard = class isCommentIdIntegerGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const commentId = request.params.commentId;
        const checkId = Number(commentId);
        if (isNaN(checkId))
            throw new common_1.NotFoundException();
        return true;
    }
};
isCommentIdIntegerGuard = __decorate([
    (0, common_1.Injectable)()
], isCommentIdIntegerGuard);
exports.isCommentIdIntegerGuard = isCommentIdIntegerGuard;
//# sourceMappingURL=param.commentid.isinteger.js.map