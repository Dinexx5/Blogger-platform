import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../features/admin/users/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../features/admin/users/domain/user.entity';
import { Repository } from 'typeorm';

@ValidatorConstraint({ name: 'IsLoginExists', async: true })
@Injectable()
export class IsLoginExistsDecorator implements ValidatorConstraintInterface {
  constructor(private readonly usersRepository: UsersRepository) {}
  async validate(loginOrEmail: string, args: ValidationArguments) {
    const user = await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (user) return false;
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `Login already exists`;
  }
}

export function IsLoginExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsLoginExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsLoginExistsDecorator,
    });
  };
}
