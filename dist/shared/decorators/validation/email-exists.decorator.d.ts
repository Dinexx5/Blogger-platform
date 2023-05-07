import { ValidationOptions, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { UsersRepository } from '../../../entities/users/users.repository';
export declare class IsEmailExistsDecorator implements ValidatorConstraintInterface {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    validate(loginOrEmail: string, args: ValidationArguments): Promise<boolean>;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsEmailExists(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
