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
let SaUsersQueryRepository = class SaUsersQueryRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async getAllUsers(query) {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10, searchLoginTerm = null, searchEmailTerm = null, banStatus = 'all', } = query;
        const skippedUsersCount = (+pageNumber - 1) * +pageSize;
        const subQuery = `(${banStatus && banStatus !== 'all'
            ? `
          ${banStatus === 'banned' ? `"isBanned" IS TRUE` : `"isBanned" IS FALSE`}
          `
            : '"isBanned" IS TRUE OR "isBanned" IS FALSE'}) AND (${searchLoginTerm && !searchEmailTerm
            ? `LOWER("login") LIKE '%' || LOWER('${searchLoginTerm}') || '%'`
            : !searchLoginTerm && searchEmailTerm
                ? `LOWER("email") LIKE '%' || LOWER('${searchEmailTerm}') || '%'`
                : searchLoginTerm && searchEmailTerm
                    ? `LOWER("login") LIKE '%' || LOWER('${searchLoginTerm}') || '%' 
                          OR  LOWER("email") LIKE '%' || LOWER('${searchEmailTerm}') || '%'`
                    : true})`;
        const selectQuery = `SELECT u.*, b."isBanned",b."banDate",b."banReason",
                                CASE
                                 WHEN "${sortBy}" = LOWER("${sortBy}") THEN 2
                                 ELSE 1
                                END toOrder
                    FROM "Users" u
                    LEFT JOIN "BanInfo" b
                    ON u."id" = b."userId"
                    WHERE ${subQuery}
                    ORDER BY toOrder,
                      CASE when $1 = 'desc' then "${sortBy}" END DESC,
                      CASE when $1 = 'asc' then "${sortBy}" END ASC
                    LIMIT $2
                    OFFSET $3
                    `;
        const counterQuery = `SELECT COUNT(*)
                    FROM "Users" u
                    LEFT JOIN "BanInfo" b
                    ON u."id" = b."userId"
                    WHERE ${subQuery}`;
        const counter = await this.dataSource.query(counterQuery);
        const count = counter[0].count;
        const users = await this.dataSource.query(selectQuery, [
            sortDirection,
            pageSize,
            skippedUsersCount,
        ]);
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
                isBanned: user.isBanned,
                banDate: user.banDate,
                banReason: user.banReason,
            },
        };
    }
};
SaUsersQueryRepository = __decorate([
    __param(0, (0, typeorm_2.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], SaUsersQueryRepository);
exports.SaUsersQueryRepository = SaUsersQueryRepository;
//# sourceMappingURL=sa.users.query-repo.js.map