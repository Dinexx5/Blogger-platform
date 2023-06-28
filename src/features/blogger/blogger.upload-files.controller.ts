import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { blogAndPostParamModel, blogParamModel } from '../public/blogs/blogs.models';
import { isBlogIdIntegerGuard } from '../auth/guards/param.blogId.integer.guard';
import { UploadWallpaperCommand } from './application/use-cases/upload-wallpaper.use-case';
import { FileInterceptor } from '@nestjs/platform-express';
import { WallpaperValidationPipe } from '../../shared/pipes/wallpaper-validation.pipe';
import { MainValidationPipe } from '../../shared/pipes/main-validation.pipe';
import { UploadMainCommand } from './application/use-cases/upload-main.use-case';
import { PostMainValidationPipe } from '../../shared/pipes/post-main-validation.pipe';
import { UploadPostMainCommand } from './application/use-cases/upload-post-main.use-case';

@Controller('blogger/blogs')
export class BloggerFilesController {
  constructor(private commandBus: CommandBus) {}
  @UseGuards(JwtAccessAuthGuard, isBlogIdIntegerGuard)
  @Post(':blogId/images/wallpaper')
  @UseInterceptors(FileInterceptor('file'))
  async uploadWallpaper(
    @UploadedFile(WallpaperValidationPipe)
    wallpaper: Express.Multer.File,
    @Param() params: blogParamModel,
    @CurrentUser() userId,
  ) {
    return await this.commandBus.execute(
      new UploadWallpaperCommand(params.blogId, userId, wallpaper.buffer),
    );
  }
  @UseGuards(JwtAccessAuthGuard, isBlogIdIntegerGuard)
  @Post(':blogId/images/main')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMainPicture(
    @UploadedFile(MainValidationPipe) mainPicture: Express.Multer.File,
    @Param() params: blogParamModel,
    @CurrentUser() userId,
  ) {
    return await this.commandBus.execute(
      new UploadMainCommand(params.blogId, userId, mainPicture.buffer),
    );
  }
  @UseGuards(JwtAccessAuthGuard, isBlogIdIntegerGuard)
  @Post(':blogId/posts/:postId/images/main')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPostMainPicture(
    @UploadedFile(PostMainValidationPipe) postMainPicture: Express.Multer.File,
    @Param() params: blogAndPostParamModel,
    @CurrentUser() userId,
  ) {
    return await this.commandBus.execute(
      new UploadPostMainCommand(params.blogId, params.postId, userId, postMainPicture.buffer),
    );
  }
  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async upload(
  //   @UploadedFile(WallpaperValidationPipe)
  //   picture: Express.Multer.File,
  // ) {
  //   return await this.commandBus.execute(new UploadWallpaperCommand(30, 1434, picture.buffer));
  // }
  // @Get('form')
  // async getForm() {
  //   return `<h1> UPLOAD FILE </h1>
  //   <form action="/blogger/blogs/upload" enctype="multipart/form-data" method="POST">
  //   <input name="file" value="" type="file"/>
  //   <button> login </button>
  //     </form>`;
  // }
}
