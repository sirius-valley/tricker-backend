import type { AuthorizationEmailVariables, IntegrationConfirmationEmailVariables } from 'domains/email/dto';

export interface EmailService {
  sendAuthorizationMail: (emailAddress: string, variables: AuthorizationEmailVariables) => Promise<void>;
  sendConfirmationMail: (emailAddress: string, variables: IntegrationConfirmationEmailVariables) => Promise<void>;
  sendDenialMail: (emailAddress: string, variables: IntegrationConfirmationEmailVariables) => Promise<void>;
}
