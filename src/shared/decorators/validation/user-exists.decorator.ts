import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../entities/users/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../entities/users/domain/user.entity';
import { Repository } from 'typeorm';

@ValidatorConstraint({ name: 'IsUserExists', async: true })
@Injectable()
export class IsUserExistsDecorator implements ValidatorConstraintInterface {
  constructor(private readonly usersRepository: UsersRepository) {}

  async validate(userId: number, args: ValidationArguments) {
    console.log(userId);
    const userInstance = await this.usersRepository.findUserById(userId);
    if (!userInstance) return false;
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `User doesn't exist`;
  }
}

export function IsUserExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUserExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUserExistsDecorator,
    });
  };
}
