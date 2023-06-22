import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { blogAndPostParamModel, blogParamModel } from '../public/blogs/blogs.models';
import { isBlogIdIntegerGuard } from '../auth/guards/param.blogId.integer.guard';
import { UploadWallpaperCommand } from './application/use-cases/upload-wallpaper.use-case';

// Controller('blogger/blogs');
// export class BloggerFilesController {
//   constructor(private commandBus: CommandBus) {}
//   @UseGuards(JwtAccessAuthGuard, isBlogIdIntegerGuard)
//   @Post(':blogId/images/wallpaper')
//   async uploadWallpaper(@Param() params: blogParamModel, @CurrentUser() userId) {
//     return await this.commandBus.execute(new UploadWallpaperCommand(blogId, userId));
//   }
//   @UseGuards(JwtAccessAuthGuard, isBlogIdIntegerGuard)
//   @Post(':blogId/images/main')
//   async uploadMainPicture(@Param() params: blogParamModel, @CurrentUser() userId) {
//     return await this.commandBus.execute(new UploadMainCommand(userId));
//   }
//   @UseGuards(JwtAccessAuthGuard, isBlogIdIntegerGuard)
//   @Post(':blogId/posts/:postId/images/main')
//   async uploadPostMainPicture(@Param() params: blogAndPostParamModel, @CurrentUser() userId) {
//     return await this.commandBus.execute(new UploadMainCommand(userId));
//   }
// }
