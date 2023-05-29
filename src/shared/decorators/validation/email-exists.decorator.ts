import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../entities/admin/users/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../entities/admin/users/domain/user.entity';
import { Repository } from 'typeorm';

@ValidatorConstraint({ name: 'IsEmailExists', async: true })
@Injectable()
export class IsEmailExistsDecorator implements ValidatorConstraintInterface {
  constructor(private readonly usersRepository: UsersRepository) {}
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
