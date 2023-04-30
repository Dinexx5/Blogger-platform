import { Controller, Delete, Get, Param, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { DevicesService } from './devices.service';
import mongoose from 'mongoose';
import { JwtRefreshAuthGuard } from '../auth/guards/jwt-refresh.guard';
import { DevicesRepository } from './devices.repository';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@Controller('/security/devices')
export class DevicesController {
  constructor(
    protected devicesService: DevicesService,
    protected devicesRepository: DevicesRepository,
  ) {}

  @UseGuards(JwtRefreshAuthGuard)
  @Get('')
  async getActiveSessions(@CurrentUser() userTokenMeta, @Res() res: Response) {
    const userId = userTokenMeta.userId;
    const foundDevices = await this.devicesService.findActiveDevices(userId);
    return res.send(foundDevices);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Delete('')
  async deleteAllSessions(@CurrentUser() userTokenMeta, @Res() res: Response) {
    await this.devicesRepository.deleteAllSessionsWithoutActive(
      userTokenMeta.deviceId,
      userTokenMeta.userId,
    );
    return res.sendStatus(204);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Delete(':id')
  async deleteSession(
    @CurrentUser() userTokenMeta,
    @Param('id') deviceId: string,
    @Res() res: Response,
  ) {
    await this.devicesService.deleteSessionById(userTokenMeta.userId, deviceId);
    return res.sendStatus(204);
  }
}
