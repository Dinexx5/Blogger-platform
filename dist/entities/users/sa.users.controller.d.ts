import { paginatedViewModel } from '../../shared/models/pagination';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserModel, SaUserViewModel, userViewModel } from './userModels';
import { SaUsersQueryRepository } from './sa.users.query-repo';
export declare class UsersSAController {
    protected usersService: UsersService;
    protected saUsersQueryRepository: SaUsersQueryRepository;
    constructor(usersService: UsersService, saUsersQueryRepository: SaUsersQueryRepository);
    getUsers(paginationQuerysSA: any): Promise<paginatedViewModel<SaUserViewModel[]>>;
    createUser(inputModel: CreateUserModel): Promise<userViewModel>;
    deleteUser(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
}
