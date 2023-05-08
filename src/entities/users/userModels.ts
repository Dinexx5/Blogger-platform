import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { IsLoginExists } from '../../shared/decorators/validation/login-exists.decorator';
import { IsEmailExists } from '../../shared/decorators/validation/email-exists.decorator';
import { IsEmailConfirmed } from '../../shared/decorators/validation/email-resending.decorator';
import { IsConfirmationCodeValid } from '../../shared/decorators/validation/confirm-email.decorator';
import { Transform } from 'class-transformer';
import { IsRecoveryCodeValid } from '../../shared/decorators/validation/password-recovery.decorator';
import { IsUserExists } from '../../shared/decorators/validation/user-exists.decorator';

export class CreateUserModel {
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @IsLoginExists()
  login: string;
  @IsNotEmpty()
  @IsEmail()
  @IsEmailExists()
  email: string;
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}

export class ResendEmailModel {
  @IsEmail()
  @IsEmailConfirmed()
  email: string;
}

export class PasswordRecoveryModel {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ConfirmEmailModel {
  @IsNotEmpty()
  @IsString()
  @IsConfirmationCodeValid()
  code: string;
}

export class NewPasswordModel {
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @Transform(({ value }) => value?.trim?.())
  newPassword: string;
  @IsString()
  @IsNotEmpty()
  @IsRecoveryCodeValid()
  recoveryCode: string;
}

export class BanModel {
  @IsBoolean()
  @IsNotEmpty()
  isBanned: boolean;
  @IsString()
  @IsNotEmpty()
  @Length(20, 300)
  banReason: string;
}
export class BanUserModelForBlog {
  @IsNumberString()
  @IsNotEmpty()
  blogId: string;
  @IsBoolean()
  @IsNotEmpty()
  isBanned: boolean;
  @IsString()
  @IsNotEmpty()
  @Length(20, 300)
  banReason: string;
}

export class UserParamModel {
  @Transform(({ value }) => +value)
  @IsUserExists()
  userId: number;
}

export class UserToBanParamModel {
  @Transform(({ value }) => +value)
  @IsUserExists()
  userId: number;
}

export class userViewModel {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public createdAt: string,
  ) {}
}

export class SaUserViewModel {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public createdAt: string,
    public banInfo: { isBanned: boolean; banDate: string; banReason: string },
  ) {}
}

export class BannedForBlogUserViewModel {
  constructor(
    public id: string,
    public login: string,
    public banInfo: { isBanned: boolean; banDate: string; banReason: string },
  ) {}
}
