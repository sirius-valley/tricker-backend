import { registerDecorator, type ValidationArguments, type ValidationOptions, ValidatorConstraint, type ValidatorConstraintInterface } from 'class-validator';
import { db } from '@utils/database';

@ValidatorConstraint({ async: true })
export class IsValidIssueProviderConstraint implements ValidatorConstraintInterface {
  async validate(issueProviderName: string, args: ValidationArguments): Promise<boolean> {
    const issueProvider = await db.issueProvider.findUnique({
      where: {
        name: issueProviderName,
      },
    });

    return issueProvider != null;
  }
}

export function IsValidIssueProvider(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidIssueProvider',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsValidIssueProviderConstraint,
    });
  };
}
