import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';
import {
  BannedForBlogUserViewModel,
  BanUserModelForBlog,
  UserToBanParamModel,
} from '../users/userModels';
import { CommandBus } from '@nestjs/cqrs';
import { BanUserForBlogCommand } from './application/use-cases/ban.user.for.blog.use-case';
import { paginatedViewModel } from '../../shared/models/pagination';
import { blogParamModel } from '../blogs/blogs.models';
import { BloggerBansQueryRepository } from './blogger.bans.query-repository';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { isUserIdIntegerGuard } from '../auth/guards/param.integer.guard';
import { isBlogIdIntegerGuard } from '../auth/guards/param.blogId.integer.guard';

@Controller('blogger/users')
export class BloggerUsersController {
  constructor(
    private commandBus: CommandBus,
    protected bloggerQueryRepository: BloggerBansQueryRepository,
  ) {}
  @UseGuards(JwtAccessAuthGuard, isUserIdIntegerGuard)
  @Put(':userId/ban')
  async banUser(
    @CurrentUser() ownerId,
    @Param('userId', ParseIntPipe) param: UserToBanParamModel,
    @Body() inputModel: BanUserModelForBlog,
    @Res() res: Response,
  ) {
    await this.commandBus.execute(new BanUserForBlogCommand(param.userId, inputModel, ownerId));
    return res.sendStatus(204);
  }
  @UseGuards(JwtAccessAuthGuard, isBlogIdIntegerGuard)
  @Get('/blog/:blogId')
  async getBannedUsers(
    @CurrentUser() userId,
    @Query() paginationQuery,
    @Param() param: blogParamModel,
  ) {
    const returnedUsers: paginatedViewModel<BannedForBlogUserViewModel[]> =
      await this.bloggerQueryRepository.getAllBannedUsersForBlog(
        paginationQuery,
        +param.blogId,
        userId,
      );
    return returnedUsers;
  }
}
