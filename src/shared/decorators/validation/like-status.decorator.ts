import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsLikeStatusCorrect', async: true })
@Injectable()
export class IsLikeStatusCorrectDecorator implements ValidatorConstraintInterface {
  async validate(likeStatus: string, args: ValidationArguments) {
    const correctStatuses = ['None', 'Like', 'Dislike'];
    const isCorrect = correctStatuses.includes(likeStatus);
    if (!isCorrect) {
      return false;
    }
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `Incorrect like status`;
  }
}

export function IsLikeStatusCorrect(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsLikeStatusCorrect',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsLikeStatusCorrectDecorator,
    });
  };
}
