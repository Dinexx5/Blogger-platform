import { deviceViewModel } from './devices.models';
import { Repository } from 'typeorm';
import { Device } from './domain/device.entity';
export declare class DevicesService {
    private readonly devicesRepository;
    constructor(devicesRepository: Repository<Device>);
    createDevice(userId: number, ip: string, deviceName: string, deviceId: string, issuedAt: string): Promise<void>;
    findActiveDevices(userId: number): Promise<deviceViewModel[]>;
    deleteSessionById(userId: number, deviceId: string): Promise<void>;
    deleteAllSessionsWithoutActive(deviceId: string, userId: number): Promise<void>;
    updateLastActiveDate(deviceId: string, newIssuedAt: string): Promise<void>;
    deleteDevice(deviceId: string): Promise<void>;
}
