import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailConfirmationInfo } from '../../../entities/users/domain/emailConfirmation.entity';
import { Repository } from 'typeorm';

@ValidatorConstraint({ name: 'confirmationCode', async: true })
@Injectable()
export class IsConfirmationCodeCorrect implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(EmailConfirmationInfo)
    private readonly emailConfirmationRepository: Repository<EmailConfirmationInfo>,
  ) {}
  async validate(code: string, args: ValidationArguments) {
    const confirmationInfo = await this.emailConfirmationRepository.findOneBy({
      confirmationCode: code,
    });
    if (!confirmationInfo) {
      return false;
    }
    if (confirmationInfo.isConfirmed) {
      return false;
    }
    if (confirmationInfo.confirmationCode !== code) {
      return false;
    }
    if (confirmationInfo.expirationDate < new Date()) {
      return false;
    }
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `confirmation code expired, incorrect or email is already confirmed`;
  }
}

export function IsConfirmationCodeValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'confirmationCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsConfirmationCodeCorrect,
    });
  };
}
