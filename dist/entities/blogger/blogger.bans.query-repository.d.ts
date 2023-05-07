import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BannedForBlogUserViewModel } from '../users/userModels';
import { BlogsRepository } from '../blogs/blogs.repository';
import { DataSource, Repository } from 'typeorm';
import { BlogOwnerInfo } from '../blogs/domain/blogOwner.entity';
import { UserBanForBlog } from './domain/userBanForBlog.entity';
export declare class BloggerBansQueryRepository {
    protected blogsRepository: BlogsRepository;
    protected dataSource: DataSource;
    private readonly blogOwnerInfoRepository;
    private readonly userBansTypeOrmRepository;
    constructor(blogsRepository: BlogsRepository, dataSource: DataSource, blogOwnerInfoRepository: Repository<BlogOwnerInfo>, userBansTypeOrmRepository: Repository<UserBanForBlog>);
    mapFoundBansToViewModel(ban: any): BannedForBlogUserViewModel;
    getAllBannedUsersForBlog(query: paginationQuerys, blogId: number, userId: number): Promise<paginatedViewModel<BannedForBlogUserViewModel[]>>;
}
