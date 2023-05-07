import { BlogsService } from '../blogs/blogs.service';
import { Response } from 'express';
import { PostsService } from '../posts/posts.service';
import { blogAndPostParamModel, blogParamModel, BlogViewModel, createBlogModel, updateBlogModel } from '../blogs/blogs.models';
import { paginatedViewModel } from '../../shared/models/pagination';
import { BlogsQueryRepository } from '../blogs/blogs.query-repo';
import { BloggerCommentsQueryRepository } from './blogger.comments.query-repo';
import { commentsForBloggerViewModel } from '../comments/comments.models';
import { createPostModel, updatePostModel } from '../posts/posts.models';
export declare class BloggerController {
    protected blogsService: BlogsService;
    protected postsService: PostsService;
    protected blogsQueryRepo: BlogsQueryRepository;
    protected bloggerCommentsQueryRepo: BloggerCommentsQueryRepository;
    constructor(blogsService: BlogsService, postsService: PostsService, blogsQueryRepo: BlogsQueryRepository, bloggerCommentsQueryRepo: BloggerCommentsQueryRepository);
    getBlogs(paginationQuery: any, userId: any): Promise<paginatedViewModel<BlogViewModel[]>>;
    getComments(paginationQuery: any, userId: any): Promise<paginatedViewModel<commentsForBloggerViewModel[]>>;
    createBlog(inputModel: createBlogModel, userId: any): Promise<BlogViewModel>;
    updateBlog(inputModel: updateBlogModel, params: blogParamModel, res: Response, userId: any): Promise<Response<any, Record<string, any>>>;
    deleteBlog(params: blogParamModel, res: Response, userId: any): Promise<Response<any, Record<string, any>>>;
    createPost(inputModel: createPostModel, params: blogParamModel, res: Response, userId: any): Promise<Response<any, Record<string, any>>>;
    updatePost(inputModel: updatePostModel, params: blogAndPostParamModel, res: Response, userId: any): Promise<Response<any, Record<string, any>>>;
    deletePost(params: blogAndPostParamModel, res: Response, userId: any): Promise<Response<any, Record<string, any>>>;
}
