import { Response } from 'express';
import { DevicesService } from './devices.service';
export declare class DevicesController {
    protected devicesService: DevicesService;
    constructor(devicesService: DevicesService);
    getActiveSessions(userTokenMeta: any, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteAllSessions(userTokenMeta: any, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteSession(userTokenMeta: any, deviceId: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
