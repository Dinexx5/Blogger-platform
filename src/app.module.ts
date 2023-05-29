import { ConfigModule } from '@nestjs/config';
const configModule = ConfigModule.forRoot({ isGlobal: true });
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './entities/admin/users/users.module';
import { AuthModule } from './entities/auth/auth.module';
import { BlogsModule } from './entities/public/blogs/blogs.module';
import { PostsModule } from './entities/public/posts/posts.module';
import { CommentsModule } from './entities/public/comments/comments.module';
import { TestingModule } from './entities/testing/testing.module';
import { BansModule } from './entities/bans/bans.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { QuestionsModule } from './entities/admin/questions/questions.module';
import { PairGameModule } from './entities/public/pair-game/pair-game.module';

export const cloudDbRootOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.SQL_HOST_NAME,
  port: 5432,
  username: process.env.SQL_USERNAME,
  password: process.env.SQL_PASS,
  database: process.env.SQL_USERNAME,
  autoLoadEntities: true,
  synchronize: true,
};
export const localDbRootOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5000,
  username: process.env.SQL_USERNAME,
  password: 'privetOLEG',
  database: 'typeORMdb',
  autoLoadEntities: true,
  synchronize: true,
};
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
