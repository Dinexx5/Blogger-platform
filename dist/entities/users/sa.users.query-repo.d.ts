import { paginatedViewModel, paginationQuerysSA } from '../../shared/models/pagination';
import { SaUserViewModel, SaUserFromSqlRepo } from './userModels';
import { DataSource } from 'typeorm';
export declare class SaUsersQueryRepository {
    protected dataSource: DataSource;
    constructor(dataSource: DataSource);
    getAllUsers(query: paginationQuerysSA): Promise<paginatedViewModel<SaUserViewModel[]>>;
    mapDbUserToUserViewModel(user: SaUserFromSqlRepo): SaUserViewModel;
}
