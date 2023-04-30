import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { createTokenModel, tokenSqlModel } from './tokens.models';

@Injectable()
export class TokenRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findToken(exp: string): Promise<tokenSqlModel | null> {
    const token = await this.dataSource.query(
      `
          SELECT *
          FROM "Tokens"
          WHERE "expiredAt" = $1
      `,
      [exp],
    );
    return token[0];
  }
  async createToken(tokenDto: createTokenModel) {
    const tokenQuery = `INSERT INTO "Tokens"
                   ("issuedAt", "expiredAt", "deviceId", "deviceName", ip, "userId")
                   VALUES ($1, $2, $3, $4, $5, $6)
                   RETURNING *;`;
    await this.dataSource.query(tokenQuery, [
      tokenDto.issuedAt,
      tokenDto.expiredAt,
      tokenDto.deviceId,
      tokenDto.deviceName,
      tokenDto.ip,
      tokenDto.userId,
    ]);
  }
  async updateToken(previousExpirationDate: string, newExpiredAt: string, newIssuedAt: string) {
    const query = `
        UPDATE "Tokens"
        SET "issuedAt"= '${newIssuedAt}', "expiredAt"= '${newExpiredAt}'
        WHERE "expiredAt" = $1
    `;
    await this.dataSource.query(query, [previousExpirationDate]);
  }
  async deleteTokensForBan(userId: string) {
    await this.dataSource.query(
      `
          DELETE
          FROM "Tokens"
          WHERE "userId" = $1
      `,
      [userId],
    );
  }
  async deleteToken(exp: string) {
    const token = await this.dataSource.query(
      `
          DELETE
          FROM "Tokens"
          WHERE "expiredAt" = $1
      `,
      [exp],
    );
    return token[0];
  }
}
