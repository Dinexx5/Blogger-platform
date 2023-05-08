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
exports.SaUsersQueryRepository = void 0;
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("./domain/user.entity");
let SaUsersQueryRepository = class SaUsersQueryRepository {
    constructor(usersTypeOrmRepository) {
        this.usersTypeOrmRepository = usersTypeOrmRepository;
    }
    async getAllUsers(query) {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10, searchLoginTerm = null, searchEmailTerm = null, banStatus = 'all', } = query;
        const skippedUsersCount = (+pageNumber - 1) * +pageSize;
        const sortDirectionSql = sortDirection === 'desc' ? 'DESC' : 'ASC';
        const bannedSubQuery = `${banStatus && banStatus !== 'all'
            ? `
          ${banStatus === 'banned' ? `bi."isBanned" = true` : `bi."isBanned" = false`}
      `
            : `"isBanned" = true OR "isBanned" = false`}`;
        const searchTermQuery = `(${searchLoginTerm && !searchEmailTerm
            ? `LOWER(u.login) LIKE LOWER(:searchLoginTerm)`
            : !searchLoginTerm && searchEmailTerm
                ? `LOWER(u.email) LIKE LOWER(:searchEmailTerm)`
                : searchLoginTerm && searchEmailTerm
                    ? `LOWER(u.login) LIKE LOWER(:searchLoginTerm) 
                          OR  LOWER(u.email) LIKE LOWER(:searchEmailTerm)`
                    : true})`;
        const builder = this.usersTypeOrmRepository
            .createQueryBuilder('u')
            .leftJoinAndSelect('u.banInfo', 'bi')
            .where(bannedSubQuery)
            .andWhere(searchTermQuery, {
            searchEmailTerm: `%${searchEmailTerm}%`,
            searchLoginTerm: `%${searchLoginTerm}%`,
        });
        const users = await builder
            .orderBy(`u.${sortBy}`, sortDirectionSql)
            .limit(+pageSize)
            .skip(skippedUsersCount)
            .getMany();
        const count = await builder.getCount();
        const usersView = users.map(this.mapDbUserToUserViewModel);
        return {
            pagesCount: Math.ceil(+count / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +count,
            items: usersView,
        };
    }
    mapDbUserToUserViewModel(user) {
        return {
            id: user.id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
            banInfo: {
                isBanned: user.banInfo.isBanned,
                banDate: user.banInfo.banDate,
                banReason: user.banInfo.banReason,
            },
        };
    }
};
SaUsersQueryRepository = __decorate([
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], SaUsersQueryRepository);
exports.SaUsersQueryRepository = SaUsersQueryRepository;
//# sourceMappingURL=sa.users.query-repo.js.map