import { Injectable } from '@nestjs/common';
import { createDeviceModel } from './devices.models';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DevicesRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
}
