import { Module } from '@nestjs/common';
import { BansUserUseCase } from './application/use-cases/ban.user.use.case.';
import { BansRepository } from '../bans/bans.repository';
import { BansController } from './bans.controller';
import { UsersModule } from '../admin/users/users.module';
import { AuthModule } from '../auth/auth.module';
import { BlogsModule } from '../public/blogs/blogs.module';
import { TokensModule } from '../tokens/token.module';
import { DevicesModule } from '../public/devices/devices.module';
import { PostsModule } from '../public/posts/posts.module';
import { CommentsModule } from '../public/comments/comments.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaUserBan } from './domain/saUserBan.entity';
import { UserBanInfo } from '../admin/users/domain/ban-info.entity';
import { SaBlogBan } from './domain/saBlogBan.entity';
import { Token } from '../tokens/domain/token.entity';
import { Device } from '../public/devices/domain/device.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SaUserBan, UserBanInfo, SaBlogBan, Token, Device]),
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
