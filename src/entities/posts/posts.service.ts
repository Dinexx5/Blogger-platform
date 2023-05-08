import { PostsRepository } from './posts.repository';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentsService } from '../comments/comments.service';
import { UsersRepository } from '../users/users.repository';
import { BlogsRepository } from '../blogs/blogs.repository';
import { UsersBansForBlogRepository } from '../bans/bans.users-for-blog.repository';
import { CommentViewModel, UpdateCommentModel } from '../comments/comments.models';
import { createPostModel, PostViewModel, updatePostModel } from './posts.models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './domain/post.entity';
import { BlogOwnerInfo } from '../blogs/domain/blogOwner.entity';
import { PostLike } from '../likes/domain/postLike.entity';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected blogsRepository: BlogsRepository,
    protected commentsService: CommentsService,
    protected usersRepository: UsersRepository,
    protected usersBansForBlogsRepo: UsersBansForBlogRepository,
    @InjectRepository(PostLike)
    private readonly postsLikesRepository: Repository<PostLike>,
    @InjectRepository(BlogOwnerInfo)
    private readonly blogOwnerInfoRepository: Repository<BlogOwnerInfo>,
    @InjectRepository(Post)
    private readonly postsTypeOrmRepository: Repository<Post>,
  ) {}

  async createPost(
    postBody: createPostModel,
    blogId: number,
    userId: number,
  ): Promise<PostViewModel | null> {
    const blog = await this.blogsRepository.findBlogById(blogId);
    if (!blog) throw new NotFoundException();
    const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
    if (blogOwnerInfo.userId !== userId) throw new ForbiddenException();
    const createdAt = new Date().toISOString();
    const post = await this.postsTypeOrmRepository.create();
    post.title = postBody.title;
    post.shortDescription = postBody.shortDescription;
    post.content = postBody.content;
    post.blogId = blogId;
    post.blogName = blog.name;
    post.createdAt = createdAt;
    await this.postsTypeOrmRepository.save(post);
    return {
      id: post.id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId.toString(),
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }

  async deletePostById(postId: number, blogId: number, userId: number) {
    const blog = await this.blogsRepository.findBlogById(blogId);
    if (!blog) throw new NotFoundException();
    const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
    if (blogOwnerInfo.userId !== userId) throw new ForbiddenException();
    const post = await this.postsRepository.findPostInstance(postId);
    if (!post) throw new NotFoundException();
    await this.postsTypeOrmRepository.remove(post);
  }

  async updatePostById(postBody: updatePostModel, postId: number, blogId: number, userId: number) {
    const blog = await this.blogsRepository.findBlogById(blogId);
    if (!blog) throw new NotFoundException();
    const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
    if (blogOwnerInfo.userId !== userId) throw new ForbiddenException();
    const post = await this.postsRepository.findPostInstance(postId);
    if (!post) throw new NotFoundException();
    post.title = postBody.title;
    post.shortDescription = postBody.shortDescription;
    post.content = postBody.content;
    post.blogId = blogId;
    await this.postsTypeOrmRepository.save(post);
  }
  async createComment(
    postId: number,
    inputModel: UpdateCommentModel,
    userId: number,
  ): Promise<CommentViewModel | null> {
    const post = await this.postsRepository.findPostInstance(postId);
    if (!post) return null;
    const forbiddenPosts = await this.usersBansForBlogsRepo.getBannedPostsForUser(userId);
    if (forbiddenPosts.includes(postId)) throw new ForbiddenException();
    return await this.commentsService.createComment(postId, inputModel, userId);
  }

  async likePost(postId: number, likeStatus: string, userId: number): Promise<boolean> {
    const post = await this.postsRepository.findPostInstance(postId);
    if (!post) return false;
    const user = await this.usersRepository.findUserById(userId);
    const like = await this.postsLikesRepository.findOneBy({
      postId: postId,
      userId: userId,
    });
    if (!like) {
      const createdAt = new Date().toISOString();
      const newLike = await this.postsLikesRepository.create();
      newLike.postId = postId;
      newLike.login = user.login;
      newLike.likeStatus = likeStatus;
      newLike.userId = userId;
      newLike.createdAt = createdAt;
      await this.postsLikesRepository.save(newLike);
      return true;
    }
    like.likeStatus = likeStatus;
    await this.postsLikesRepository.save(like);
    return true;
  }
}
