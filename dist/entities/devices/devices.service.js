"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const device_entity_1 = require("./domain/device.entity");
let DevicesService = class DevicesService {
    constructor(devicesRepository) {
        this.devicesRepository = devicesRepository;
    }
    async createDevice(userId, ip, deviceName, deviceId, issuedAt) {
        const device = await this.devicesRepository.create();
        device.userId = userId;
        device.ip = ip;
        device.title = deviceName;
        device.deviceId = deviceId;
        device.lastActiveDate = issuedAt;
        await this.devicesRepository.save(device);
    }
    async findActiveDevices(userId) {
        const foundDevices = await this.devicesRepository.findBy({ userId: userId });
        return foundDevices.map((device) => ({
            ip: device.ip,
            title: device.title,
            lastActiveDate: device.lastActiveDate,
            deviceId: device.deviceId,
        }));
    }
    async deleteSessionById(userId, deviceId) {
        const foundDevice = await this.devicesRepository.findOneBy({ deviceId: deviceId });
        if (!foundDevice)
            throw new common_1.NotFoundException();
        if (foundDevice.userId !== userId)
            throw new common_1.ForbiddenException();
        await this.devicesRepository.remove(foundDevice);
    }
    async deleteAllSessionsWithoutActive(deviceId, userId) {
        const notActiveSessions = await this.devicesRepository.findBy({
            deviceId: (0, typeorm_2.Not)(deviceId),
            userId: userId,
        });
        await this.devicesRepository.remove(notActiveSessions);
    }
    async updateLastActiveDate(deviceId, newIssuedAt) {
        const foundDevice = await this.devicesRepository.findOneBy({ deviceId: deviceId });
        foundDevice.lastActiveDate = newIssuedAt;
        await this.devicesRepository.save(foundDevice);
    }
    async deleteDevice(deviceId) {
        await this.devicesRepository.delete(deviceId);
    }
};
DevicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(device_entity_1.Device)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DevicesService);
exports.DevicesService = DevicesService;
//# sourceMappingURL=devices.service.js.map