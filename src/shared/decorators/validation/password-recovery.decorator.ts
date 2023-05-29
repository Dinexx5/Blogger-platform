import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordRecoveryInfo } from '../../../entities/admin/users/domain/password-recovery.entity';

@ValidatorConstraint({ name: 'recoveryCode', async: true })
@Injectable()
export class IsRecoveryCodeCorrect implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(PasswordRecoveryInfo)
    private readonly passwordRecoveryRepository: Repository<PasswordRecoveryInfo>,
  ) {}
  async validate(code: string, args: ValidationArguments) {
    const recoveryInfo = await this.passwordRecoveryRepository.findOneBy({ recoveryCode: code });
    if (!recoveryInfo) {
      return false;
    }
    if (!recoveryInfo.expirationDate) {
      return false;
    }
    if (recoveryInfo.recoveryCode !== code) {
      return false;
    }
    if (recoveryInfo.expirationDate < new Date()) {
      return false;
    }
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `confirmation code expired, incorrect or email is already confirmed`;
  }
}

export function IsRecoveryCodeValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'recoveryCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsRecoveryCodeCorrect,
    });
  };
}
