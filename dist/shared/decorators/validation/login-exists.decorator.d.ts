import { ValidationOptions, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { UsersRepository } from '../../../entities/users/users.repository';
export declare class IsLoginExistsDecorator implements ValidatorConstraintInterface {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    validate(loginOrEmail: string, args: ValidationArguments): Promise<boolean>;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsLoginExists(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
