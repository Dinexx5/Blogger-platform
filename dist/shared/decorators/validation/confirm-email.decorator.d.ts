import { ValidationOptions, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { EmailConfirmationInfo } from '../../../entities/users/domain/emailConfirmation.entity';
import { Repository } from 'typeorm';
export declare class IsConfirmationCodeCorrect implements ValidatorConstraintInterface {
    private readonly emailConfirmationRepository;
    constructor(emailConfirmationRepository: Repository<EmailConfirmationInfo>);
    validate(code: string, args: ValidationArguments): Promise<boolean>;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsConfirmationCodeValid(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
