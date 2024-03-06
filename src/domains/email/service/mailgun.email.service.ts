import { type IMailgunClient } from 'mailgun.js/Interfaces';
import process from 'process';
import { type EmailService } from '@domains/email/service/email.service';
import type { AuthorizationEmailVariables, IntegrationConfirmationEmailVariables } from 'domains/email/dto';
import path from 'path';
import { prepareHtmlTemplate } from '@utils/templating';

export class MailgunEmailService implements EmailService {
  constructor(private readonly client: IMailgunClient) {}

  /**
   * Sends an email to confirm that a project has been integrated, to the specified email address.
   * The email contains information regarding project integration authorization.
   * @param {string} emailAddress - The email address to which the authorization email will be sent.
   * @param {IntegrationConfirmationEmailVariables} variables - The variables to be used in the email template.
   * @returns {Promise<void>} A Promise that resolves when the email is successfully sent.
   */
  async sendConfirmationMail(emailAddress: string, variables: IntegrationConfirmationEmailVariables): Promise<void> {
    await this.client.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: 'Tricker <no-reply@tricker.com>',
      to: emailAddress,
      subject: 'Project Integration Confirmation',
      html: await prepareHtmlTemplate(path.join(__dirname, 'email-templates/project_integration_finished.html'), variables),
    });
  }

  /**
   * Sends an authorization email to the specified email address.
   * The email contains information regarding project integration authorization.
   * @param {string} emailAddress - The email address to which the authorization email will be sent.
   * @param {AuthorizationEmailVariables} variables - The variables to be used in the email template.
   * @returns {Promise<void>} A Promise that resolves when the email is successfully sent.
   */
  async sendAuthorizationMail(emailAddress: string, variables: AuthorizationEmailVariables): Promise<void> {
    await this.client.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: 'Tricker <no-reply@tricker.com>',
      to: emailAddress,
      subject: 'Project Integration Authorization',
      html: await prepareHtmlTemplate(path.join(__dirname, 'email-templates/access_request.html'), variables),
    });
  }

  async sendDenialMail(emailAddress: string, variables: IntegrationConfirmationEmailVariables): Promise<void> {
    await this.client.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: 'Tricker <no-reply@tricker.com>',
      to: emailAddress,
      subject: 'Project Integration Confirmation',
      html: await prepareHtmlTemplate(path.join(__dirname, 'email-templates/access_request.html'), variables), // await this.setDynamicWords('./src/utils/email-templates/declined_request.html', [{ wordToReplace: '{{projectName}}', replacingWord: projectName }]),
    });
  }
}
