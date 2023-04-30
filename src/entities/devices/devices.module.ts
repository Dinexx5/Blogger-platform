import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { DevicesRepository } from './devices.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './domain/device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  providers: [DevicesService, DevicesRepository],
  controllers: [DevicesController],
  exports: [DevicesService, DevicesRepository],
})
export class DevicesModule {}
