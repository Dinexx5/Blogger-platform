import { ValidationOptions, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { UsersRepository } from '../../../entities/users/users.repository';
export declare class EmailResendingDecorator implements ValidatorConstraintInterface {
    protected usersRepository: UsersRepository;
    constructor(usersRepository: UsersRepository);
    validate(email: string, args: ValidationArguments): Promise<boolean>;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsEmailConfirmed(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
