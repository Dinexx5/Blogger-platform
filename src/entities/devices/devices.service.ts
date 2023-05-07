import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { deviceViewModel } from './devices.models';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Device } from './domain/device.entity';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private readonly devicesRepository: Repository<Device>,
  ) {}
  async createDevice(
    userId: number,
    ip: string,
    deviceName: string,
    deviceId: string,
    issuedAt: string,
  ) {
    const device = await this.devicesRepository.create();
    device.userId = userId;
    device.ip = ip;
    device.title = deviceName;
    device.deviceId = deviceId;
    device.lastActiveDate = issuedAt;
    await this.devicesRepository.save(device);
  }
  async findActiveDevices(userId: number): Promise<deviceViewModel[]> {
    const foundDevices: Device[] = await this.devicesRepository.findBy({ userId: userId });
    return foundDevices.map((device) => ({
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.lastActiveDate,
      deviceId: device.deviceId,
    }));
  }
  async deleteSessionById(userId: number, deviceId: string) {
    const foundDevice: Device = await this.devicesRepository.findOneBy({ deviceId: deviceId });
    if (!foundDevice) throw new NotFoundException();
    if (foundDevice.userId !== userId) throw new ForbiddenException();
    await this.devicesRepository.remove(foundDevice);
  }

  async deleteAllSessionsWithoutActive(deviceId: string, userId: number) {
    const notActiveSessions: Device[] = await this.devicesRepository.findBy({
      deviceId: Not(deviceId),
      userId: userId,
    });
    await this.devicesRepository.remove(notActiveSessions);
  }

  async updateLastActiveDate(deviceId: string, newIssuedAt: string) {
    const foundDevice: Device = await this.devicesRepository.findOneBy({ deviceId: deviceId });
    foundDevice.lastActiveDate = newIssuedAt;
    await this.devicesRepository.save(foundDevice);
  }

  async deleteDevice(deviceId: string) {
    await this.devicesRepository.delete(deviceId);
  }
}
