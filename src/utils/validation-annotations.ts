import { registerDecorator, type ValidationArguments, type ValidationOptions, ValidatorConstraint, type ValidatorConstraintInterface } from 'class-validator';
import { db } from '@utils/database';
import { type OrganizationRepository, OrganizationRepositoryImpl } from '@domains/organization/repository';
import { type IssueProviderRepository, IssueProviderRepositoryImpl } from '@domains/issueProvider/repository';
import { LinearClient } from '@linear/sdk';
import { type AuthorizationRequestDTO } from '@domains/integration/dto';
import { compareDesc, endOfDay } from 'date-fns';

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
    const issueProvider = issueProviderRepository.getByName(issueProviderName.trim().toUpperCase());
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
 * Validator constraint class for checking if a date (in form of string) is after today or today to the provided date.
 */
@ValidatorConstraint()
export class IsTodayOrAfterTodayConstraint implements ValidatorConstraintInterface {
  validate(dateInput: string, args: ValidationArguments): boolean | Promise<boolean> {
    // date parameter of annotation
    const [date] = args.constraints;
    if (date !== undefined && !(date instanceof Date)) throw new Error();

    const userInput = new Date(dateInput);

    return userInput.toString() !== 'Invalid Date' && compareDesc(userInput, date ?? endOfDay(new Date())) > 0;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Date is not today or after today';
  }
}

/**
 * Validates whether a date is after or equal to the provided date.
 * @param {Date} date - The date to compare against. If not provided, today's date will be used
 * @param {ValidationOptions} validationOptions - Additional validation options.
 */
export function IsTodayOrAfterToday(date?: Date, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isTodayOrAfterToday',
      target: object.constructor,
      propertyName,
      constraints: [date],
      options: validationOptions,
      validator: IsTodayOrAfterTodayConstraint,
    });
  };
}
