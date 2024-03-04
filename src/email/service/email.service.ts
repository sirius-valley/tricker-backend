import { type EmailVariables } from '@email/dto';

export interface EmailService {
  sendAuthorizationMail: (emailAddress: string, variables: EmailVariables) => Promise<void>;
}
