export declare class CreateUserModel {
    login: string;
    email: string;
    password: string;
}
export declare class ResendEmailModel {
    email: string;
}
export declare class PasswordRecoveryModel {
    email: string;
}
export declare class ConfirmEmailModel {
    code: string;
}
export declare class NewPasswordModel {
    newPassword: string;
    recoveryCode: string;
}
export declare class BanModel {
    isBanned: boolean;
    banReason: string;
}
export declare class BanUserModelForBlog {
    blogId: string;
    isBanned: boolean;
    banReason: string;
}
export declare class UserParamModel {
    userId: number;
}
export declare class UserToBanParamModel {
    userId: number;
}
export declare class userViewModel {
    id: string;
    login: string;
    email: string;
    createdAt: string;
    constructor(id: string, login: string, email: string, createdAt: string);
}
export declare class SaUserViewModel {
    id: string;
    login: string;
    email: string;
    createdAt: string;
    banInfo: {
        isBanned: boolean;
        banDate: string;
        banReason: string;
    };
    constructor(id: string, login: string, email: string, createdAt: string, banInfo: {
        isBanned: boolean;
        banDate: string;
        banReason: string;
    });
}
export declare class BannedForBlogUserViewModel {
    id: string;
    login: string;
    banInfo: {
        isBanned: boolean;
        banDate: string;
        banReason: string;
    };
    constructor(id: string, login: string, banInfo: {
        isBanned: boolean;
        banDate: string;
        banReason: string;
    });
}
