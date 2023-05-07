"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const posts_repository_1 = require("./posts.repository");
const common_1 = require("@nestjs/common");
const comments_service_1 = require("../comments/comments.service");
const users_repository_1 = require("../users/users.repository");
const blogs_repository_1 = require("../blogs/blogs.repository");
const bans_users_for_blog_repository_1 = require("../bans/bans.users-for-blog.repository");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("./domain/post.entity");
const blogOwner_entity_1 = require("../blogs/domain/blogOwner.entity");
const postLike_entity_1 = require("../likes/domain/postLike.entity");
let PostsService = class PostsService {
    constructor(postsRepository, blogsRepository, commentsService, usersRepository, usersBansForBlogsRepo, postsLikesRepository, blogOwnerInfoRepository, postsTypeOrmRepository) {
        this.postsRepository = postsRepository;
        this.blogsRepository = blogsRepository;
        this.commentsService = commentsService;
        this.usersRepository = usersRepository;
        this.usersBansForBlogsRepo = usersBansForBlogsRepo;
        this.postsLikesRepository = postsLikesRepository;
        this.blogOwnerInfoRepository = blogOwnerInfoRepository;
        this.postsTypeOrmRepository = postsTypeOrmRepository;
    }
    async createPost(postBody, blogId, userId) {
        const blog = await this.blogsRepository.findBlogById(blogId);
        if (!blog)
            throw new common_1.NotFoundException();
        const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
        if (blogOwnerInfo.userId !== userId)
            throw new common_1.ForbiddenException();
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
    async deletePostById(postId, blogId, userId) {
        const blog = await this.blogsRepository.findBlogById(blogId);
        if (!blog)
            throw new common_1.NotFoundException();
        const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
        if (blogOwnerInfo.userId !== userId)
            throw new common_1.ForbiddenException();
        const post = await this.postsRepository.findPostInstance(postId);
        if (!post)
            throw new common_1.NotFoundException();
        await this.postsTypeOrmRepository.remove(post);
    }
    async updatePostById(postBody, postId, blogId, userId) {
        const blog = await this.blogsRepository.findBlogById(blogId);
        if (!blog)
            throw new common_1.NotFoundException();
        const blogOwnerInfo = await this.blogOwnerInfoRepository.findOneBy({ blogId: blogId });
        if (blogOwnerInfo.userId !== userId)
            throw new common_1.ForbiddenException();
        const post = await this.postsRepository.findPostInstance(postId);
        if (!post)
            throw new common_1.NotFoundException();
        post.title = postBody.title;
        post.shortDescription = postBody.shortDescription;
        post.content = postBody.content;
        post.blogId = blogId;
        await this.postsTypeOrmRepository.save(post);
    }
    async createComment(postId, inputModel, userId) {
        const post = await this.postsRepository.findPostInstance(postId);
        if (!post)
            return null;
        const forbiddenPosts = await this.usersBansForBlogsRepo.getBannedPostsForUser(userId);
        if (forbiddenPosts.includes(postId))
            throw new common_1.ForbiddenException();
        return await this.commentsService.createComment(postId, inputModel, userId);
    }
    async likePost(postId, likeStatus, userId) {
        const post = await this.postsRepository.findPostInstance(postId);
        if (!post)
            return false;
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
};
PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(5, (0, typeorm_1.InjectRepository)(postLike_entity_1.PostLike)),
    __param(6, (0, typeorm_1.InjectRepository)(blogOwner_entity_1.BlogOwnerInfo)),
    __param(7, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [posts_repository_1.PostsRepository,
        blogs_repository_1.BlogsRepository,
        comments_service_1.CommentsService,
        users_repository_1.UsersRepository,
        bans_users_for_blog_repository_1.UsersBansForBlogRepository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PostsService);
exports.PostsService = PostsService;
//# sourceMappingURL=posts.service.js.map