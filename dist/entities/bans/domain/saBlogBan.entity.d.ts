import { Blog } from '../../blogs/domain/blog.entity';
export declare class SaBlogBan {
    isBanned: boolean;
    bannedPostsIds: number[];
    blogId: number;
    blog: Blog;
}
