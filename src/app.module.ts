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
import { TelegramController } from './features/integrations/telegram.controller';
import { TelegramAdapter } from './adapters/telegram.adapter';
import { CqrsModule } from '@nestjs/cqrs';
import { TelegramService } from './features/integrations/application/telegram-service';
import { HandleRegistrationMessageUseCase } from './features/integrations/application/use-cases/handle-registration-message.use-case';
import { TgAuthCodeEntity } from './features/integrations/domain/tg-auth-code.entity';
import { SubscriptionEntity } from './features/integrations/domain/subscription.entity';
import { GetTgAuthLinkUseCase } from './features/integrations/application/use-cases/get-tg-auth-link.use-case';

@Module({
  imports: [
    configModule,
    TypeOrmModule.forFeature([TgAuthCodeEntity, SubscriptionEntity]),
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
    CqrsModule,
  ],
  controllers: [AppController, TelegramController],
  providers: [
    AppService,
    TelegramAdapter,
    TelegramService,
    HandleRegistrationMessageUseCase,
    GetTgAuthLinkUseCase,
  ],
})
export class AppModule {}
