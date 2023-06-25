import { ConfigModule } from '@nestjs/config';
const configModule = ConfigModule.forRoot({ isGlobal: true });
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './features/admin/users/users.module';
import { AuthModule } from './features/auth/auth.module';
import { BlogsModule } from './features/public/blogs/blogs.module';
import { PostsModule } from './features/public/posts/posts.module';
import { CommentsModule } from './features/public/comments/comments.module';
import { TestingModule } from './features/testing/testing.module';
import { BansModule } from './features/bans/bans.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsModule } from './features/admin/questions/questions.module';
import { PairGameModule } from './features/public/pair-game/pair-game.module';
import { cloudDbRootOptions, localDbRootOptions } from './app.db.root';

@Module({
  imports: [
    configModule,
    TypeOrmModule.forRoot(cloudDbRootOptions),
    BansModule,
    UsersModule,
    AuthModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
    TestingModule,
    QuestionsModule,
    PairGameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
