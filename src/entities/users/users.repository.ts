import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createUser(
    login: string,
    email: string,
    passwordHash: string,
    createdAt: string,
    expirationDate: Date,
    confirmationCode: string,
    isConfirmed: boolean,
  ) {
    const userQuery = `INSERT INTO "Users"
                   (login, email, "passwordHash", "createdAt")
                   VALUES ($1, $2, $3, $4)
                   RETURNING *;`;

    const banQuery = `INSERT INTO "BanInfo"
                   ("userId", "isBanned", "banDate", "banReason")
                   VALUES ($1, $2, $3, $4)
                   RETURNING *;`;

    const emailConfirmationQuery = `INSERT INTO "EmailConfirmation"
                   ("userId", "confirmationCode", "expirationDate", "isConfirmed")
                   VALUES ($1, $2, $3, $4)
                   RETURNING *;`;
    const passwordRecoveryQuery = `INSERT INTO "PasswordRecovery"
                   ("userId", "recoveryCode", "expirationDate")
                   VALUES ($1, $2, $3)
                   RETURNING *;`;

    const result = await this.dataSource.query(userQuery, [login, email, passwordHash, createdAt]);
    await this.dataSource.query(banQuery, [result[0].id, false, null, null]);
    await this.dataSource.query(emailConfirmationQuery, [
      result[0].id,
      confirmationCode,
      expirationDate,
      isConfirmed,
    ]);
    await this.dataSource.query(passwordRecoveryQuery, [result[0].id, null, null]);

    return result[0];
  }

  async findUserById(userId: string) {
    const users = await this.dataSource.query(
      `
          SELECT *
          FROM "Users"
          WHERE "id" = $1
      `,
      [userId],
    );
    return users[0];
  }
  async deleteUser(userId: string) {
    await this.dataSource.query(
      `
          DELETE
          FROM "BanInfo"
          WHERE "userId" = $1
      `,
      [userId],
    );
    await this.dataSource.query(
      `
          DELETE
          FROM "EmailConfirmation"
          WHERE "userId" = $1
      `,
      [userId],
    );
    await this.dataSource.query(
      `
          DELETE
          FROM "PasswordRecovery"
          WHERE "userId" = $1
      `,
      [userId],
    );
    await this.dataSource.query(
      `
          DELETE
          FROM "Users"
          WHERE "id" = $1
      `,
      [userId],
    );
    return true;
  }
  async updateBanInfoForBan(userId: string, banDate: string, banReason: string) {
    const query = `
        UPDATE "BanInfo"
        SET "isBanned"= true, "banDate"= '${banDate}', "banReason"= '${banReason}'
        WHERE "userId" = $1
    `;
    await this.dataSource.query(query, [userId]);
  }
  async updateBanInfoForUnban(userId: string) {
    await this.dataSource.query(
      `
          UPDATE "BanInfo"
          SET "isBanned"= false, "banDate"= null, "banReason"= null
          WHERE "userId" = $1
      `,
      [userId],
    );
  }
  async findConfirmation(userId: string) {
    const isConfirmed = await this.dataSource.query(
      `
          SELECT *
          FROM "EmailConfirmation"
          WHERE "userId" = $1
      `,
      [userId],
    );
    return isConfirmed[0].isConfirmed;
  }
  async findConfirmationInfo(userId: string) {
    const isConfirmed = await this.dataSource.query(
      `
          SELECT *
          FROM "EmailConfirmation"
          WHERE "userId" = $1
      `,
      [userId],
    );
    return isConfirmed[0];
  }
  async findPasswordRecoveryInfo(userId: string) {
    const isConfirmed = await this.dataSource.query(
      `
          SELECT *
          FROM "PasswordRecovery"
          WHERE "userId" = $1
      `,
      [userId],
    );
    return isConfirmed[0];
  }
  async findUserByConfirmationCode(code: string) {
    const user = await this.dataSource.query(
      `
          SELECT *
          FROM "EmailConfirmation"
          WHERE "confirmationCode" = $1
      `,
      [code],
    );
    return user[0];
  }
  async updateConfirmation(code: string) {
    await this.dataSource.query(
      `
          UPDATE "EmailConfirmation"
          SET "isConfirmed" = true
          WHERE "confirmationCode" = $1
      `,
      [code],
    );
  }
  async updateConfirmationCode(userId: string, code: string) {
    await this.dataSource.query(
      `
          UPDATE "EmailConfirmation"
          SET "confirmationCode" = '${code}'
          WHERE "userId" = $1
      `,
      [userId],
    );
  }
  async findUserByLoginOrEmail(loginOrEmail: string) {
    const users = await this.dataSource.query(
      `
          SELECT *
          FROM "Users"
          WHERE "login" = $1 OR "email" = $1
      `,
      [loginOrEmail],
    );
    return users[0];
  }
  async findUserByRecoveryCode(code: string) {
    const user = await this.dataSource.query(
      `
          SELECT *
          FROM "PasswordRecovery"
          WHERE "recoveryCode" = $1
      `,
      [code],
    );
    return user[0];
  }
  async updateRecoveryCode(userId: string, recoveryCode: string, expirationDate: Date) {
    await this.dataSource.query(
      `
          UPDATE "PasswordRecovery"
          SET "recoveryCode" = '${recoveryCode}', "expirationDate" = '${expirationDate}'
          WHERE "userId" = $1
      `,
      [userId],
    );
  }
  async updatePassword(userId: string, passwordHash: string) {
    await this.dataSource.query(
      `
          UPDATE "Users"
          SET "passwordHash" = '${passwordHash}'
          WHERE "userId" = $1
      `,
      [userId],
    );
  }
}
