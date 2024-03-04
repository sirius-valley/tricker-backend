import { type EmailService } from '@email/service/email.service';
import { type IMailgunClient } from 'mailgun.js/Interfaces';
import process from 'process';
import { type EmailVariables } from '@email/dto';
import { readFile } from 'node:fs/promises';
import { ConflictException } from '@utils';
import path from 'path';

export class MailgunEmailService implements EmailService {
  constructor(private readonly client: IMailgunClient) {}

  /**
   * Sends an authorization email to the specified email address.
   * The email contains information regarding project integration authorization.
   * @param {string} emailAddress - The email address to which the authorization email will be sent.
   * @param {EmailVariables} variables - The variables to be used in the email template.
   * @returns {Promise<void>} A Promise that resolves when the email is successfully sent.
   */
  async sendAuthorizationMail(emailAddress: string, variables: EmailVariables): Promise<void> {
    await this.client.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: 'Tricker <no-reply@tricker.com>',
      to: emailAddress,
      subject: 'Project Integration Authorization',
      html: await this.prepareHtmlTemplate(path.join(__dirname, 'access_request.html'), variables),
    });
  }

  /**
   * Reads an HTML template file from the specified path and replaces placeholders with provided variables.
   * @param {string} path - The path to the HTML template file.
   * @param {EmailVariables} variables - The variables to be replaced in the HTML template.
   * @returns {Promise<string>} A Promise that resolves with the HTML content after replacing placeholders.
   * @throws {ConflictException} Throws a ConflictException if HTML conversion fails.
   */
  private async prepareHtmlTemplate(path: string, variables: EmailVariables): Promise<string> {
    try {
      let html: string = await readFile(path, 'utf8');
      for (const key of Object.keys(variables)) {
        html = html.replace(`{{${key}}}`, variables[key]);
      }
      return html;
    } catch (err) {
      throw new ConflictException('Html conversion failed');
    }
  }
}
