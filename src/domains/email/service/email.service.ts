export interface EmailService {
  sendAuthorizationMail: (emailAddress: string) => Promise<void>;
  sendConfirmationMail: (emailAddress: string, projectName: string) => Promise<void>;
  sendDenialMail: (emailAddress: string, projectName: string) => Promise<void>;
}
