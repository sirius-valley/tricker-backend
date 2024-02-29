import { type EmailService } from '@email/email.service';
import { type IMailgunClient } from 'mailgun.js/Interfaces';
import process from 'process';

export class MailgunEmailService implements EmailService {
  constructor(private readonly client: IMailgunClient) {}

  async sendAuthorizationMail(emailAddress: string): Promise<void> {
    await this.client.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: 'Tricker <no-reply@tricker.com>',
      to: emailAddress,
      subject: 'Project Integration Authorization',
      html: '<h1>Integration</h1>',
    });
  }
}
