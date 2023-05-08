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
}
