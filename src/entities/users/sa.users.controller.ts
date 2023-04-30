import { Body, Controller, Delete, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';

import { paginatedViewModel } from '../../shared/models/pagination';
import { Response } from 'express';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateUserModel, SaUserViewModel, userViewModel } from './userModels';
import { SaUsersQueryRepository } from './sa.users.query-repo';
import { isUserIdIntegerGuard } from '../auth/guards/param.integer.guard';

@Controller('sa/users')
export class UsersSAController {
  constructor(
    protected usersService: UsersService,
    protected saUsersQueryRepository: SaUsersQueryRepository,
  ) {}
  @UseGuards(AuthGuard)
  @Get()
  async getUsers(@Query() paginationQuerysSA) {
    const returnedUsers: paginatedViewModel<SaUserViewModel[]> =
      await this.saUsersQueryRepository.getAllUsers(paginationQuerysSA);
    return returnedUsers;
  }
  @UseGuards(AuthGuard)
  @Post()
  async createUser(@Body() inputModel: CreateUserModel) {
    const createdUser: userViewModel = await this.usersService.createUser(inputModel);
    return createdUser;
  }
  @UseGuards(AuthGuard, isUserIdIntegerGuard)
  @Delete(':userId')
  async deleteUser(@Param('userId') id: string, @Res() res: Response) {
    const isDeleted = await this.usersService.deleteUserById(id);
    if (!isDeleted) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  }
}
