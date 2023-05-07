import { Comment } from './comment.entity';
import { Post } from '../../posts/domain/post.entity';
import { Blog } from '../../blogs/domain/blog.entity';
export declare class PostInfoForComment {
    commentId: number;
    title: string;
    blogName: string;
    post: Post;
    blog: Blog;
    comment: Comment;
    postId: number;
    blogId: number;
}
