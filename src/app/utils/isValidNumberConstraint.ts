import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidNumber', async: false })
export class IsValidIntConstraint implements ValidatorConstraintInterface {
  validate(id: number) {
    return typeof id === 'number' && Number.isInteger(id) && id >= 0;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a positive interger string!`;
  }
}
