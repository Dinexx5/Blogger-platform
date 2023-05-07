import { AuthService } from './auth-service';
import { Response } from 'express';
import { UsersRepository } from '../users/users.repository';
import { ConfirmEmailModel, CreateUserModel, NewPasswordModel, PasswordRecoveryModel, ResendEmailModel } from '../users/userModels';
export declare class AuthController {
    private readonly authService;
    protected usersRepository: UsersRepository;
    constructor(authService: AuthService, usersRepository: UsersRepository);
    login(req: any, userId: number, res: Response): Promise<void>;
    getProfile(userId: number, res: Response): Promise<void>;
    getRefreshToken(userTokenMeta: any, res: Response): Promise<void>;
    deleteCurrentSession(user: any, res: Response): Promise<Response<any, Record<string, any>>>;
    registerUser(inputModel: CreateUserModel, res: Response): Promise<Response<any, Record<string, any>>>;
    resendEmail(inputModel: ResendEmailModel, res: Response): Promise<Response<any, Record<string, any>>>;
    confirmEmail(inputModel: ConfirmEmailModel, res: Response): Promise<Response<any, Record<string, any>>>;
    recoverPassword(inputModel: PasswordRecoveryModel, res: Response): Promise<Response<any, Record<string, any>>>;
    newPassword(inputModel: NewPasswordModel, res: Response): Promise<Response<any, Record<string, any>>>;
}
