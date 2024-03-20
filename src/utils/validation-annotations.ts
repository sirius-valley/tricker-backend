import { registerDecorator, type ValidationArguments, type ValidationOptions, ValidatorConstraint, type ValidatorConstraintInterface } from 'class-validator';
import { db } from '@utils/database';
import { type OrganizationRepository, OrganizationRepositoryImpl } from '@domains/organization/repository';
import { type IssueProviderRepository, IssueProviderRepositoryImpl } from '@domains/issueProvider/repository';
import { LinearClient } from '@linear/sdk';
import { type AuthorizationRequestDTO } from '@domains/integration/dto';

const organizationRepository: OrganizationRepository = new OrganizationRepositoryImpl(db);
const issueProviderRepository: IssueProviderRepository = new IssueProviderRepositoryImpl(db);

@ValidatorConstraint({ async: true })
export class IsValidOrganizationConstraint implements ValidatorConstraintInterface {
  async validate(organizationName: string, args: ValidationArguments): Promise<boolean> {
    const organization = organizationRepository.getByName(organizationName);
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
    const issueProvider = issueProviderRepository.getByName(issueProviderName);
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

// idea about having a custom annotation to validate api keys that taken into account different issue providers
@ValidatorConstraint({ async: true })
export class IsValidApiKeyConstraint implements ValidatorConstraintInterface {
  async validate(apiKey: string, args: ValidationArguments): Promise<boolean> {
    const issueProviderName = (args.object as AuthorizationRequestDTO).issueProviderName;
    if (issueProviderName === 'LINEAR') {
      try {
        const linearClient = new LinearClient({ apiKey });
        await linearClient.viewer;
      } catch (e: any) {
        return false;
      }
    }
    return true;
  }
}

export function IsValidApiKey(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidApiKey',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsValidApiKeyConstraint,
    });
  };
}

/**
 * Validator constraint class for checking if a date (in form of string) is after or equal to the provided date.
 */
@ValidatorConstraint()
export class IsAfterOrEqualDateConstraint implements ValidatorConstraintInterface {
  validate(dateInput: any, args: ValidationArguments): boolean | Promise<boolean> {
    const [date] = args.constraints;
    const userInput = new Date(dateInput as string);
    return typeof dateInput === 'string' && userInput.toString() !== 'Invalid Date' && date instanceof Date && userInput.getTime() >= date.getTime();
  }
}

/**
 * Validates whether a date is after or equal to the provided date.
 * @param {Date} date - The date to compare against.
 * @param {ValidationOptions} validationOptions - Additional validation options.
 */
export function IsAfterOrEqualDate(date: Date, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfterOrEqualDate',
      target: object.constructor,
      propertyName,
      constraints: [date],
      options: validationOptions,
      validator: IsAfterOrEqualDateConstraint,
    });
  };
}
