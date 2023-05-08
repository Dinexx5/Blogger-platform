import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BannedForBlogUserViewModel } from '../users/userModels';
import { BlogsRepository } from '../blogs/blogs.repository';
import { Repository } from 'typeorm';
import { BlogOwnerInfo } from '../blogs/domain/blogOwner.entity';
import { UserBanForBlog } from './domain/userBanForBlog.entity';
export declare class BloggerBansQueryRepository {
    protected blogsRepository: BlogsRepository;
    private readonly blogOwnerInfoRepository;
    private readonly userBansTypeOrmRepository;
    constructor(blogsRepository: BlogsRepository, blogOwnerInfoRepository: Repository<BlogOwnerInfo>, userBansTypeOrmRepository: Repository<UserBanForBlog>);
    mapFoundBansToViewModel(ban: any): BannedForBlogUserViewModel;
    getAllBannedUsersForBlog(query: paginationQuerys, blogId: number, userId: number): Promise<paginatedViewModel<BannedForBlogUserViewModel[]>>;
}
