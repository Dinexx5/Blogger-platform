import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../entities/users/users.repository';

@ValidatorConstraint({ name: 'IsEmailExists', async: true })
@Injectable()
export class IsEmailExistsDecorator implements ValidatorConstraintInterface {
  constructor(protected usersRepository: UsersRepository) {}
  async validate(loginOrEmail: string, args: ValidationArguments) {
    const user = await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (user) return false;
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `Email already exists`;
  }
}

export function IsEmailExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsEmailExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsEmailExistsDecorator,
    });
  };
}
