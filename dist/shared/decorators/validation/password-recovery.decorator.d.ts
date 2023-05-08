import { ValidationOptions, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Repository } from 'typeorm';
import { PasswordRecoveryInfo } from '../../../entities/users/domain/passwordRecovery.entity';
export declare class IsRecoveryCodeCorrect implements ValidatorConstraintInterface {
    private readonly passwordRecoveryRepository;
    constructor(passwordRecoveryRepository: Repository<PasswordRecoveryInfo>);
    validate(code: string, args: ValidationArguments): Promise<boolean>;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsRecoveryCodeValid(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
