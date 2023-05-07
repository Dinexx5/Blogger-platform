import { DataSource, Repository } from 'typeorm';
import { User } from './domain/user.entity';
export declare class UsersRepository {
    protected dataSource: DataSource;
    private readonly usersTypeOrmRepository;
    constructor(dataSource: DataSource, usersTypeOrmRepository: Repository<User>);
    findUserById(userId: number): Promise<User>;
    findUserByLoginOrEmail(login: string): Promise<User>;
    save(user: User): Promise<void>;
    findConfirmation(userId: string): Promise<any>;
    findUserByConfirmationCode(code: string): Promise<any>;
    findUserByRecoveryCode(code: string): Promise<any>;
}
