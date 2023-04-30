import { PostsRepository } from './posts.repository';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentsService } from '../comments/comments.service';
import { UsersRepository } from '../users/users.repository';
import { BlogsRepository } from '../blogs/blogs.repository';
import { PostsLikesRepository } from '../likes/posts.likes.repository';
import { UsersBansForBlogRepository } from '../bans/bans.users-for-blog.repository';
import { CommentViewModel, CreateCommentModel } from '../comments/comments.models';
import { createPostModel, PostViewModel, updatePostModel } from './posts.models';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected blogsRepository: BlogsRepository,
    protected commentsService: CommentsService,
    protected usersRepository: UsersRepository,
    protected postsLikesRepository: PostsLikesRepository,
    protected usersBansForBlogsRepo: UsersBansForBlogRepository,
  ) {}

  async createPost(
    postBody: createPostModel,
    blogId: string,
    userId: string,
  ): Promise<PostViewModel | null> {
    const blog = await this.blogsRepository.findBlogInstance(blogId);
    if (!blog) throw new NotFoundException();
    const blogOwnerInfo = await this.blogsRepository.findBlogOwnerInfo(blogId);
    if (blogOwnerInfo.userId.toString() !== userId) throw new ForbiddenException();
    const createdAt = new Date().toISOString();
    const createdPost = await this.postsRepository.createPost(
      postBody.title,
      postBody.shortDescription,
      postBody.content,
      blogId,
      blog.name,
      createdAt,
    );
    return {
      id: createdPost.id.toString(),
      title: createdPost.title,
      shortDescription: createdPost.shortDescription,
      content: createdPost.content,
      blogId: createdPost.blogId.toString(),
      blogName: createdPost.blogName,
      createdAt: createdPost.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }

  async deletePostById(postId: string, blogId: string, userId: string) {
    const blog = await this.blogsRepository.findBlogInstance(blogId);
    if (!blog) throw new NotFoundException();
    const blogOwnerInfo = await this.blogsRepository.findBlogOwnerInfo(blogId);
    if (blogOwnerInfo.userId.toString() !== userId) throw new ForbiddenException();
    const post = await this.postsRepository.findPostInstance(postId);
    if (!post) throw new NotFoundException();
    await this.postsRepository.deletePost(postId);
  }

  async updatePostById(postBody: updatePostModel, postId: string, blogId: string, userId: string) {
    const blog = await this.blogsRepository.findBlogInstance(blogId);
    if (!blog) throw new NotFoundException();
    const blogOwnerInfo = await this.blogsRepository.findBlogOwnerInfo(blogId);
    if (blogOwnerInfo.userId.toString() !== userId) throw new ForbiddenException();
    const post = await this.postsRepository.findPostInstance(postId);
    if (!post) throw new NotFoundException();
    await this.postsRepository.updatePost(
      postId,
      postBody.title,
      postBody.shortDescription,
      postBody.content,
      blogId,
    );
  }
  async createComment(
    postId: string,
    inputModel: CreateCommentModel,
    userId: string,
  ): Promise<CommentViewModel | null> {
    const post = await this.postsRepository.findPostInstance(postId);
    if (!post) return null;
    const forbiddenPosts = await this.usersBansForBlogsRepo.getBannedPostsForUser(userId);
    if (forbiddenPosts.includes(postId)) throw new ForbiddenException();
    return await this.commentsService.createComment(postId, inputModel, userId);
  }

  async likePost(postId: string, likeStatus: string, userId: string): Promise<boolean> {
    const post = await this.postsRepository.findPostInstance(postId);
    if (!post) return false;
    const user = await this.usersRepository.findUserById(userId);
    const like = await this.postsLikesRepository.findLikeByPostIdAndUserId(postId, userId);
    if (!like) {
      const createdAt = new Date().toISOString();
      await this.postsLikesRepository.likePost(postId, likeStatus, userId, user.login, createdAt);
      return true;
    }
    await this.postsLikesRepository.updateLikeStatus(postId, userId, likeStatus);
    return true;
  }
}
