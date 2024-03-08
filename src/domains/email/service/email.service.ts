import { type AuthorizationEmailVariables, type IntegrationConfirmationEmailVariables, type IntegrationRequestEmailVariables } from 'domains/email/dto';

export interface EmailService {
  sendAuthorizationMail: (emailAddress: string, variables: AuthorizationEmailVariables) => Promise<void>;
  sendConfirmationMail: (emailAddress: string, variables: IntegrationConfirmationEmailVariables) => Promise<void>;
  sendDenialMail: (emailAddress: string, variables: IntegrationRequestEmailVariables) => Promise<void>;
  sendAcceptanceMail: (emailAddress: string, variables: IntegrationRequestEmailVariables) => Promise<void>;
}
