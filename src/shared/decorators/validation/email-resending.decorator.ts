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
import { Repository } from 'typeorm';
import { EmailConfirmationInfo } from '../../../entities/users/domain/emailConfirmation.entity';

@ValidatorConstraint({ name: 'isEmailConfirmed', async: true })
@Injectable()
export class EmailResendingDecorator implements ValidatorConstraintInterface {
  constructor(
    protected usersRepository: UsersRepository,
    @InjectRepository(EmailConfirmationInfo)
    private readonly emailConfirmationRepository: Repository<EmailConfirmationInfo>,
  ) {}
  async validate(email: string, args: ValidationArguments) {
    const user = await this.usersRepository.findUserByLoginOrEmail(email);
    if (!user) return false;
    const confirmation = await this.emailConfirmationRepository.findOneBy({ userId: user.id });
    if (confirmation.isConfirmed === true) {
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
