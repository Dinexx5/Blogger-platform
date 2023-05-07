import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './domain/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(User)
    private readonly usersTypeOrmRepository: Repository<User>,
  ) {}

  async findUserById(userId: number) {
    return await this.usersTypeOrmRepository.findOneBy({ id: userId });
  }
  async findUserByLoginOrEmail(login: string) {
    return await this.usersTypeOrmRepository.findOne({
      where: [{ login: login }, { email: login }],
    });
  }
  async save(user: User) {
    await this.usersTypeOrmRepository.save(user);
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
}
