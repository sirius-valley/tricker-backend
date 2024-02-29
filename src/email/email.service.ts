export interface EmailService {
  sendAuthorizationMail: (emailAddress: string, variables: { token: string }) => Promise<void>;
}
