import { paginatedViewModel, paginationQuerysSA } from '../../shared/models/pagination';
import { SaUserViewModel } from './userModels';
import { Repository } from 'typeorm';
import { User } from './domain/user.entity';
export declare class SaUsersQueryRepository {
    private readonly usersTypeOrmRepository;
    constructor(usersTypeOrmRepository: Repository<User>);
    getAllUsers(query: paginationQuerysSA): Promise<paginatedViewModel<SaUserViewModel[]>>;
    mapDbUserToUserViewModel(user: any): SaUserViewModel;
}
