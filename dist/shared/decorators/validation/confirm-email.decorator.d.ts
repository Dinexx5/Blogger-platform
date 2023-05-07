import { ValidationOptions, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { UsersRepository } from '../../../entities/users/users.repository';
export declare class IsConfirmationCodeCorrect implements ValidatorConstraintInterface {
    protected usersRepository: UsersRepository;
    constructor(usersRepository: UsersRepository);
    validate(code: string, args: ValidationArguments): Promise<boolean>;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsConfirmationCodeValid(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
