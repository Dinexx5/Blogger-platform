import { ValidationOptions, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { UsersRepository } from '../../../entities/users/users.repository';
export declare class IsUserExistsDecorator implements ValidatorConstraintInterface {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    validate(userId: number, args: ValidationArguments): Promise<boolean>;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsUserExists(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
