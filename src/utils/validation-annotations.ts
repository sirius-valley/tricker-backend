import { registerDecorator, type ValidationArguments, type ValidationOptions, ValidatorConstraint, type ValidatorConstraintInterface } from 'class-validator';
import { db } from '@utils/database';

@ValidatorConstraint({ async: true })
export class IsValidOrganizationConstraint implements ValidatorConstraintInterface {
  async validate(organizationName: string, args: ValidationArguments): Promise<boolean> {
    const organization = await db.organization.findUnique({
      where: {
        name: organizationName,
      },
    });

    return organization != null;
  }
}

export function IsValidOrganization(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidOrganization',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsValidOrganizationConstraint,
    });
  };
}

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
