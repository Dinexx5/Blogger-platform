import { Blog } from './blog.entity';
import { User } from '../../users/domain/user.entity';
export declare class BlogOwnerInfo {
    userLogin: string;
    blog: Blog;
    user: User;
    blogId: number;
    userId: number;
}
