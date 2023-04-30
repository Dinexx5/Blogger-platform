import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../entities/users/users.repository';

@ValidatorConstraint({ name: 'isEmailConfirmed', async: true })
@Injectable()
export class EmailResendingDecorator implements ValidatorConstraintInterface {
  constructor(protected usersRepository: UsersRepository) {}
  async validate(email: string, args: ValidationArguments) {
    const user = await this.usersRepository.findUserByLoginOrEmail(email);
    if (!user) return false;
    const confirmation = await this.usersRepository.findConfirmation(user.id.toString());
    if (confirmation === true) {
      return false;
    }
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `user with provided email does not exist or already confirmed`;
  }
}

export function IsEmailConfirmed(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsLoginOrEmailExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: EmailResendingDecorator,
    });
  };
}
