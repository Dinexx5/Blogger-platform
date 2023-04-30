import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DevicesRepository } from './devices.repository';
import { deviceViewModel } from './devices.models';

@Injectable()
export class DevicesService {
  constructor(protected devicesRepository: DevicesRepository) {}
  async createDevice(
    userId: string,
    ip: string,
    deviceName: string,
    deviceId: string,
    issuedAt: string,
  ) {
    const deviceDTO = {
      userId: userId,
      ip: ip,
      title: deviceName,
      deviceId: deviceId,
      lastActiveDate: issuedAt,
    };
    await this.devicesRepository.createDevice(deviceDTO);
  }
  async findActiveDevices(userId: string): Promise<deviceViewModel[]> {
    const foundDevices = await this.devicesRepository.findSessions(userId);
    return foundDevices.map((device) => ({
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.lastActiveDate,
      deviceId: device.deviceId,
    }));
  }
  async deleteSessionById(userId: string, deviceId: string) {
    const foundDevice = await this.devicesRepository.findSessionByDeviceId(deviceId);
    if (!foundDevice) throw new NotFoundException();
    if (foundDevice.userId.toString() !== userId) throw new ForbiddenException();
    await this.devicesRepository.deleteDevice(deviceId);
  }
}
