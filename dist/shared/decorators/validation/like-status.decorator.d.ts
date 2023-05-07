import { ValidationOptions, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare class IsLikeStatusCorrectDecorator implements ValidatorConstraintInterface {
    validate(likeStatus: string, args: ValidationArguments): Promise<boolean>;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsLikeStatusCorrect(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
