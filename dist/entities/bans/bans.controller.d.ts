import { BanModel, UserParamModel } from '../users/userModels';
import { Response } from 'express';
import { CommandBus } from '@nestjs/cqrs';
export declare class BansController {
    private commandBus;
    constructor(commandBus: CommandBus);
    banUser(param: UserParamModel, inputModel: BanModel, res: Response): Promise<Response<any, Record<string, any>>>;
}
