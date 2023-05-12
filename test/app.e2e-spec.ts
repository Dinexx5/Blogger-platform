import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { appSetupTests } from '../src/app.setup.tests';
import { SaUserViewModel } from '../src/entities/users/user.models';
import { BlogViewModel } from '../src/entities/blogs/blogs.models';
import { CommentViewModel } from '../src/entities/comments/comments.models';
import { PostViewModel } from '../src/entities/posts/posts.models';
import { QuestionViewModel } from '../src/entities/quiz/question.models';

jest.setTimeout(120000);

describe('ALL BANS FLOWS (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app = appSetupTests(app, '');
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  describe('ban user by super admin tests', () => {
    let user: SaUserViewModel;
    let user2: SaUserViewModel;
    let validAccessToken: { accessToken: string };
    let validAccessToken2: { accessToken: string };
    let blog: BlogViewModel;
    let blog2: BlogViewModel;
    let post: PostViewModel;
    let post2: PostViewModel;
    let responseComment: CommentViewModel;

    beforeAll(async () => {
      await request(app.getHttpServer()).delete(`/testing/all-data`).expect(204);

      const response00 = await request(app.getHttpServer())
        .post(`/sa/users`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          login: 'asirius',
          password: 'asirius321',
          email: 'asirius@jive.com',
        })
        .expect(201);
      user = response00.body;
      expect(user).toEqual({
        id: expect.any(String),
        login: 'asirius',
        email: 'asirius@jive.com',
        createdAt: expect.any(String),
        banInfo: {
          isBanned: false,
          banDate: null,
          banReason: null,
        },
      });

      const response01 = await request(app.getHttpServer())
        .post(`/sa/users`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          login: 'asirius2',
          password: 'asirius321',
          email: 'asirius2@jive.com',
        })
        .expect(201);
      user2 = response01.body;
      expect(user2).toEqual({
        id: expect.any(String),
        login: 'asirius2',
        email: 'asirius2@jive.com',
        createdAt: expect.any(String),
        banInfo: {
          isBanned: false,
          banDate: null,
          banReason: null,
        },
      });

      const responseToken = await request(app.getHttpServer())
        .post(`/auth/login`)
        .set(`User-Agent`, `for test`)
        .send({ loginOrEmail: 'asirius', password: 'asirius321' })
        .expect(200);
      validAccessToken = responseToken.body;
      expect(validAccessToken).toEqual({ accessToken: expect.any(String) });

      const responseToken1 = await request(app.getHttpServer())
        .post(`/auth/login`)
        .set(`User-Agent`, `for test`)
        .send({ loginOrEmail: 'asirius2', password: 'asirius321' })
        .expect(200);
      validAccessToken2 = responseToken1.body;
      expect(validAccessToken2).toEqual({ accessToken: expect.any(String) });

      const responseBlog = await request(app.getHttpServer())
        .post(`/blogger/blogs/`)
        .auth(validAccessToken.accessToken, { type: 'bearer' })
        .send({
          name: 'Mongoose',
          description: 'genetically diverged into two main',
          websiteUrl: 'https://www.mongoose.com',
        })
        .expect(201);
      blog = responseBlog.body;
      expect(blog).toEqual({
        id: expect.any(String),
        isMembership: false,
        name: 'Mongoose',
        description: 'genetically diverged into two main',
        websiteUrl: 'https://www.mongoose.com',
        createdAt: expect.any(String),
      });

      const responseBlog2 = await request(app.getHttpServer())
        .post(`/blogger/blogs/`)
        .auth(validAccessToken2.accessToken, { type: 'bearer' })
        .send({
          name: 'Mongoose',
          description: 'genetically diverged into two main ',
          websiteUrl: 'https://www.mongoose.com',
        })
        .expect(201);
      blog2 = responseBlog2.body;

      const responsePost = await request(app.getHttpServer())
        .post(`/blogger/blogs/${blog.id}/posts`)
        .auth(validAccessToken.accessToken, { type: 'bearer' })
        .send({
          title: 'string113231423',
          shortDescription: 'fasdfdsfsd',
          content: 'strifdasdfsadfsadfng',
        })
        .expect(201);
      post = responsePost.body;

      const responsePost2 = await request(app.getHttpServer())
        .post(`/blogger/blogs/${blog2.id}/posts`)
        .auth(validAccessToken2.accessToken, { type: 'bearer' })
        .send({
          title: 'string113231423',
          shortDescription: 'fasdfdsfsd',
          content: 'strifdasdfsadfsadfng',
        })
        .expect(201);
      post2 = responsePost2.body;

      const responseGetComment = await request(app.getHttpServer())
        .post(`/posts/${post.id}/comments`)
        .auth(validAccessToken2.accessToken, { type: 'bearer' })
        .send({
          content: '33333333333333333333333',
        })
        .expect(201);

      responseComment = responseGetComment.body;
    });

    it('should return status 404 after get comment for banned user2', async () => {
      await request(app.getHttpServer())
        .put(`/sa/users/${user2.id}/ban`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          isBanned: true,
          banReason: 'stringstringstringststringstringstringst',
        })
        .expect(204);

      await request(app.getHttpServer()).get(`/comments/${responseComment.id}`).expect(404);
    });

    it('should return blog and status 200 for not banned user', async () => {
      const responseBlogWithoutUserBan = await request(app.getHttpServer())
        .get(`/blogs/${blog.id}`)
        .expect(200);
      const responseBody = responseBlogWithoutUserBan.body;
      expect(responseBody).toEqual(blog);
    });

    it('should return 404 after get blog for banned user1', async () => {
      await request(app.getHttpServer())
        .put(`/sa/users/${user.id}/ban`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          isBanned: true,
          banReason: 'stringstringstringstst',
        })
        .expect(204);

      const responseO = await request(app.getHttpServer()).get(`/blogs/${blog.id}`).expect(404);
    });

    it('should return comment for unbanned user, change user instance', async () => {
      await request(app.getHttpServer())
        .put(`/sa/users/${user2.id}/ban`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          isBanned: false,
          banReason: 'stringstringstringstst',
        })
        .expect(204);

      const users = await request(app.getHttpServer())
        .get(`/sa/users/`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .expect(200);

      const findedUser: SaUserViewModel = users.body.items.find(
        (u: SaUserViewModel) => u.id === user2.id,
      );
      expect(findedUser.banInfo.isBanned).toBeFalsy();
      expect(findedUser.banInfo.banReason).toBeNull();

      await request(app.getHttpServer()).get(`/comments/${responseComment.id}`).expect(200);
    });

    it('Should not login banned user', async () => {
      await request(app.getHttpServer())
        .post(`/auth/login`)
        .send({
          loginOrEmail: 'asirius',
          password: 'asirius321',
        })
        .expect(401);
    });

    it('Should not show posts of banned user, should show post of not banned user', async () => {
      await request(app.getHttpServer()).get(`/posts/${post.id}`).expect(404);
      const postsWithoutBannedUsers = await request(app.getHttpServer()).get(`/posts`).expect(200);

      const result = postsWithoutBannedUsers.body.items.find((p) => p.blogId === post.blogId);

      expect(result).toBeFalsy();

      await request(app.getHttpServer()).get(`/posts/${post2.id}`).expect(200);
    });
  });

  describe('ban blog by super admin tests', () => {
    let blog: BlogViewModel;
    let post: PostViewModel;
    let user: SaUserViewModel;
    let validAccessToken: { accessToken: string };

    beforeAll(async () => {
      await request(app.getHttpServer()).delete(`/testing/all-data`).expect(204);

      const response00 = await request(app.getHttpServer())
        .post(`/sa/users`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          login: 'govnokoder',
          password: 'qwerty321',
          email: 'qwertyuiop@jive.com',
        })
        .expect(201);
      user = response00.body;
      expect(user).toEqual({
        id: expect.any(String),
        login: 'govnokoder',
        email: 'qwertyuiop@jive.com',
        createdAt: expect.any(String),
        banInfo: {
          isBanned: false,
          banDate: null,
          banReason: null,
        },
      });

      const responseToken = await request(app.getHttpServer())
        .post(`/auth/login`)
        .set(`User-Agent`, `for test`)
        .send({ loginOrEmail: 'govnokoder', password: 'qwerty321' })
        .expect(200);
      validAccessToken = responseToken.body;
      expect(validAccessToken).toEqual({ accessToken: expect.any(String) });

      const responseBlog = await request(app.getHttpServer())
        .post(`/blogger/blogs/`)
        .auth(validAccessToken.accessToken, { type: 'bearer' })
        .send({
          name: 'BlogGovnokoda',
          description: 'Here we make some shitposts pretending to know how to code',
          websiteUrl: 'https://www.mongoose.com',
        })
        .expect(201);
      blog = responseBlog.body;
      expect(blog).toEqual({
        id: expect.any(String),
        isMembership: false,
        name: 'BlogGovnokoda',
        description: 'Here we make some shitposts pretending to know how to code',
        websiteUrl: 'https://www.mongoose.com',
        createdAt: expect.any(String),
      });

      const responsePost = await request(app.getHttpServer())
        .post(`/blogger/blogs/${blog.id}/posts`)
        .auth(validAccessToken.accessToken, { type: 'bearer' })
        .send({
          title: 'string113231423',
          shortDescription: 'fasdfdsfsd',
          content: 'strifdasdfsadfsadfng',
        })
        .expect(201);
      post = responsePost.body;
    });

    it('should ban blog', async () => {
      await request(app.getHttpServer())
        .put(`/sa/blogs/${blog.id}/ban`)
        .auth('admin', 'qwerty')
        .send({
          isBanned: true,
        })
        .expect(204);

      const blogs = await request(app.getHttpServer())
        .get(`/sa/blogs/`)
        .auth('admin', 'qwerty')
        .expect(200);

      const currentBlog = blogs.body.items.find((b) => b.id === blog.id);

      expect(currentBlog.banInfo.isBanned).toBeTruthy();
      expect(currentBlog.banInfo.banDate).not.toBeNull();
    });

    it('should hide posts for banned blog', async () => {
      const postsRes = await request(app.getHttpServer()).get(`/posts`).expect(200);

      const posts = postsRes.body;

      expect(posts.items).toHaveLength(0);
    });

    it('should hide banned blogs', async () => {
      const blogsRes = await request(app.getHttpServer()).get(`/blogs`).expect(200);

      const blogs = blogsRes.body;

      expect(blogs.items).toHaveLength(0);
    });

    it('should unban blog', async () => {
      await request(app.getHttpServer())
        .put(`/sa/blogs/${blog.id}/ban`)
        .auth('admin', 'qwerty')
        .send({
          isBanned: false,
        })
        .expect(204);

      const blogs = await request(app.getHttpServer())
        .get(`/sa/blogs/`)
        .auth('admin', 'qwerty')
        .expect(200);

      const currentBlog = blogs.body.items.find((b) => b.id === blog.id);

      expect(currentBlog.banInfo.isBanned).toBeFalsy();
      expect(currentBlog.banInfo.banDate).toBeNull();
    });

    it('should show posts for unbanned blog', async () => {
      const postsRes = await request(app.getHttpServer()).get(`/posts`).expect(200);

      const posts = postsRes.body;

      expect(posts.items).toHaveLength(1);
    });
  });

  describe('ban user for blog tests', () => {
    let blog: BlogViewModel;
    let post: PostViewModel;
    let comment: CommentViewModel;
    let user: SaUserViewModel;
    let bannedUser;
    let validAccessToken: { accessToken: string };
    let validAccessToken2: { accessToken: string };

    beforeAll(async () => {
      await request(app.getHttpServer()).delete(`/testing/all-data`).expect(204);

      const response00 = await request(app.getHttpServer())
        .post(`/sa/users`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          login: 'govnokoder',
          password: 'qwerty321',
          email: 'qwertyuiop@jive.com',
        })
        .expect(201);
      user = response00.body;
      expect(user).toEqual({
        id: expect.any(String),
        login: 'govnokoder',
        email: 'qwertyuiop@jive.com',
        createdAt: expect.any(String),
        banInfo: {
          isBanned: false,
          banDate: null,
          banReason: null,
        },
      });
      const banResponse = await request(app.getHttpServer())
        .post(`/sa/users`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          login: 'bannedUser',
          password: 'qwerty321',
          email: 'qwerty@live.com',
        });
      bannedUser = banResponse.body;

      const responseToken = await request(app.getHttpServer())
        .post(`/auth/login`)
        .set(`User-Agent`, `for test`)
        .send({ loginOrEmail: 'govnokoder', password: 'qwerty321' })
        .expect(200);
      validAccessToken = responseToken.body;
      expect(validAccessToken).toEqual({ accessToken: expect.any(String) });

      const responseToken2 = await request(app.getHttpServer())
        .post(`/auth/login`)
        .set(`User-Agent`, `for test`)
        .send({ loginOrEmail: 'bannedUser', password: 'qwerty321' })
        .expect(200);
      validAccessToken2 = responseToken2.body;
      expect(validAccessToken2).toEqual({ accessToken: expect.any(String) });

      const responseBlog = await request(app.getHttpServer())
        .post(`/blogger/blogs/`)
        .auth(validAccessToken.accessToken, { type: 'bearer' })
        .send({
          name: 'BlogGovnokoda',
          description: 'Here we make some shitposts pretending to know how to code',
          websiteUrl: 'https://www.mongoose.com',
        })
        .expect(201);
      blog = responseBlog.body;
      expect(blog).toEqual({
        id: expect.any(String),
        isMembership: false,
        name: 'BlogGovnokoda',
        description: 'Here we make some shitposts pretending to know how to code',
        websiteUrl: 'https://www.mongoose.com',
        createdAt: expect.any(String),
      });

      const responsePost = await request(app.getHttpServer())
        .post(`/blogger/blogs/${blog.id}/posts`)
        .auth(validAccessToken.accessToken, { type: 'bearer' })
        .send({
          title: 'string113231423',
          shortDescription: 'fasdfdsfsd',
          content: 'strifdasdfsadfsadfng',
        })
        .expect(201);
      post = responsePost.body;

      const responseComment = await request(app.getHttpServer())
        .post(`/posts/${post.id}/comments`)
        .auth(validAccessToken2.accessToken, { type: 'bearer' })
        .send({
          content: 'strifdasdfsadfsadfngdasdasdadad',
        })
        .expect(201);
      comment = responseComment.body;
      expect(comment).toEqual({
        id: expect.any(String),
        content: expect.any(String),
        commentatorInfo: {
          userId: bannedUser.id.toString(),
          userLogin: 'bannedUser',
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: expect.any(Number),
          dislikesCount: expect.any(Number),
          myStatus: expect.any(String),
        },
      });
    });

    it('should ban user and show ban', async () => {
      const postComments = await request(app.getHttpServer())
        .get(`/posts/${post.id}/comments`)
        .expect(200);

      expect(postComments.body.items).toHaveLength(1);

      await request(app.getHttpServer())
        .put(`/blogger/users/${bannedUser.id}/ban`)
        .auth(validAccessToken.accessToken, { type: 'bearer' })
        .send({
          isBanned: true,
          banReason: 'stringstringstringst',
          blogId: blog.id,
        })
        .expect(204);
      const responseForGetBans = await request(app.getHttpServer())
        .get(`/blogger/users/blog/${blog.id}`)
        .auth(validAccessToken.accessToken, { type: 'bearer' })
        .expect(200);
      const bans = responseForGetBans.body.items;
      expect(bans).toHaveLength(1);
      expect(bans[0]).toEqual({
        id: bannedUser.id.toString(),
        login: bannedUser.login,
        banInfo: {
          isBanned: true,
          banDate: expect.any(String),
          banReason: expect.any(String),
        },
      });
    });
    it('should not allow for banned user to comment', async () => {
      await request(app.getHttpServer())
        .post(`/posts/${post.id}/comments`)
        .auth(validAccessToken2.accessToken, { type: 'bearer' })
        .send({
          content: '33333333333333333333333',
        })
        .expect(403);
    });
    it('should unban user', async () => {
      await request(app.getHttpServer())
        .put(`/blogger/users/${bannedUser.id}/ban`)
        .auth(validAccessToken.accessToken, { type: 'bearer' })
        .send({
          isBanned: false,
          banReason: 'stringstringstringst',
          blogId: blog.id,
        })
        .expect(204);
      const responseForGetBans = await request(app.getHttpServer())
        .get(`/blogger/users/blog/${blog.id}`)
        .auth(validAccessToken.accessToken, { type: 'bearer' })
        .expect(200);
      expect(responseForGetBans.body.items).toEqual([]);
    });
    it('unbanned user should be able to comment', async () => {
      await request(app.getHttpServer())
        .post(`/posts/${post.id}/comments`)
        .auth(validAccessToken2.accessToken, { type: 'bearer' })
        .send({
          content: '33333333333333333333333',
        })
        .expect(201);
    });
  });
  describe('Questions crud', () => {
    let user: SaUserViewModel;
    let validAccessToken: { accessToken: string };
    let question1: QuestionViewModel;
    let question2: QuestionViewModel;

    beforeAll(async () => {
      await request(app.getHttpServer()).delete(`/testing/all-data`).expect(204);
    });

    it('should return an empty array when no questions exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/sa/quiz/questions')
        .auth('admin', 'qwerty', { type: 'basic' })
        .expect(200);

      expect(response.body).toEqual({
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      });
    });
    it('should not create question containing more than 1 answer', async () => {
      const createQuestionDto = {
        body: 'What is the capital of France?',
        correctAnswers: ['Paris', 'Minsk'],
      };
      await request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .auth('admin', 'qwerty', { type: 'basic' })
        .send(createQuestionDto)
        .expect(400);
    });
    it('should create a question', async () => {
      const createQuestionDto = {
        body: 'What is the capital of France?',
        correctAnswers: ['Paris, Minsk'],
      };

      const response = await request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .auth('admin', 'qwerty', { type: 'basic' })
        .send(createQuestionDto)
        .expect(201);
      question1 = response.body;

      expect(question1).toEqual({
        id: expect.any(String),
        body: 'What is the capital of France?',
        correctAnswers: ['Paris, Minsk'],
        published: false,
        createdAt: expect.any(String),
        updatedAt: null,
      });
    });
    it('should not create a question without auth', async () => {
      const createQuestionDto = {
        body: 'What is the capital of Belarus?',
        correctAnswers: ['Minsk'],
      };

      await request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .send(createQuestionDto)
        .expect(401);
    });
    it('should create second question', async () => {
      const createQuestionDto = {
        body: 'What is the capital of Austria?',
        correctAnswers: ['Vienna'],
      };
      const response = await request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .auth('admin', 'qwerty', { type: 'basic' })
        .send(createQuestionDto)
        .expect(201);
      question2 = response.body;
    });
    it('should return an array containing 2 questions', async () => {
      const response = await request(app.getHttpServer())
        .get('/sa/quiz/questions')
        .auth('admin', 'qwerty', { type: 'basic' })
        .expect(200);

      expect(response.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [question2, question1],
      });
    });
    it('should return 404 status code if question was not found', async () => {
      await request(app.getHttpServer())
        .delete('/sa/quiz/questions/999')
        .auth('admin', 'qwerty', { type: 'basic' })
        .expect(404);
    });
    it('should delete questions by id', async () => {
      await request(app.getHttpServer())
        .delete(`/sa/quiz/questions/${question1.id}`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .expect(204);
    });
    it('should return only one question after delete', async () => {
      const response = await request(app.getHttpServer())
        .get('/sa/quiz/questions')
        .auth('admin', 'qwerty', { type: 'basic' })
        .expect(200);
      expect(response.body.items).toHaveLength(1);
    });
    it('should update question', async () => {
      const updateDto = {
        body: 'newQuestion',
        correctAnswers: ['newAnswer1, newAnswer2'],
      };
      await request(app.getHttpServer())
        .put(`/sa/quiz/questions/${question2.id}`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send(updateDto)
        .expect(204);
      const getResponse = await request(app.getHttpServer())
        .get('/sa/quiz/questions')
        .auth('admin', 'qwerty', { type: 'basic' })
        .expect(200);

      expect(getResponse.body.items[0]).toEqual({
        id: expect.any(String),
        body: 'newQuestion',
        correctAnswers: ['newAnswer1, newAnswer2'],
        published: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
    it('should update published status', async () => {
      const updateDto = {
        published: true,
      };
      await request(app.getHttpServer())
        .put(`/sa/quiz/questions/${question2.id}/publish`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send(updateDto)
        .expect(204);
      const getResponse = await request(app.getHttpServer())
        .get('/sa/quiz/questions')
        .auth('admin', 'qwerty', { type: 'basic' })
        .expect(200);

      expect(getResponse.body.items[0]).toEqual({
        id: expect.any(String),
        body: 'newQuestion',
        correctAnswers: ['newAnswer1, newAnswer2'],
        published: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
    it('should noy update question that does not exist', async () => {
      const updateDto = {
        body: 'newQuestion',
        correctAnswers: ['newAnswer1, newAnswer2'],
      };
      await request(app.getHttpServer())
        .put(`/sa/quiz/questions/99999`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send(updateDto)
        .expect(404);
    });
  });
});
