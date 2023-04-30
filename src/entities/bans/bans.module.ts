import { Module } from '@nestjs/common';
import { BansUserUseCase } from './application/use-cases/ban.user.use.case.';
import { BansRepository } from '../bans/bans.repository';
import { BansController } from './bans.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { BlogsModule } from '../blogs/blogs.module';
import { TokensModule } from '../tokens/token.module';
import { DevicesModule } from '../devices/devices.module';
import { PostsModule } from '../posts/posts.module';
import { CommentsModule } from '../comments/comments.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaUserBan } from './domain/saUserBan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SaUserBan]),
    CqrsModule,
    UsersModule,
    AuthModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
    TokensModule,
    DevicesModule,
  ],
  providers: [BansUserUseCase, BansRepository],
  controllers: [BansController],
  exports: [BansUserUseCase, BansRepository],
})
export class BansModule {}
