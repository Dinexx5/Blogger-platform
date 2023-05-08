import { ValidationOptions, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { UsersRepository } from '../../../entities/users/users.repository';
import { Repository } from 'typeorm';
import { EmailConfirmationInfo } from '../../../entities/users/domain/emailConfirmation.entity';
export declare class EmailResendingDecorator implements ValidatorConstraintInterface {
    protected usersRepository: UsersRepository;
    private readonly emailConfirmationRepository;
    constructor(usersRepository: UsersRepository, emailConfirmationRepository: Repository<EmailConfirmationInfo>);
    validate(email: string, args: ValidationArguments): Promise<boolean>;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsEmailConfirmed(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
