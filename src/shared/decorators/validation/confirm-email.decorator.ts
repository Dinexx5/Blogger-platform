import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../entities/users/users.repository';

@ValidatorConstraint({ name: 'confirmationCode', async: true })
@Injectable()
export class IsConfirmationCodeCorrect implements ValidatorConstraintInterface {
  constructor(protected usersRepository: UsersRepository) {}
  async validate(code: string, args: ValidationArguments) {
    const user = await this.usersRepository.findUserByConfirmationCode(code);
    if (!user) {
      return false;
    }
    if (user.isConfirmed) {
      return false;
    }
    if (user.confirmationCode !== code) {
      return false;
    }
    if (user.expirationDate < new Date()) {
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
