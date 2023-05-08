import { Blog } from '../../blogs/domain/blog.entity';
import { PostLike } from '../../likes/domain/postLike.entity';
export declare class Post {
    id: number;
    title: string;
    shortDescription: string;
    content: string;
    blogId: number;
    blogName: string;
    createdAt: string;
    blog: Blog;
    likes: PostLike[];
}
