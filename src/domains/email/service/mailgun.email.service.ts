import { type IMailgunClient } from 'mailgun.js/Interfaces';
import process from 'process';
import { type EmailService } from '@domains/email/service/email.service';
import { type AuthorizationEmailVariables, type IntegrationConfirmationEmailVariables, type IntegrationRequestEmailVariables } from 'domains/email/dto';
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

  /**
   * Sends a denial email to the specified email address.
   * The email informs the user that their project integration request has been denied.
   * @param {string} emailAddress - The email address to which the denial email will be sent.
   * @param {IntegrationRequestEmailVariables} variables - The variables to be used in the email template.
   * @returns {Promise<void>} A Promise that resolves when the email is successfully sent.
   */
  async sendDenialMail(emailAddress: string, variables: IntegrationRequestEmailVariables): Promise<void> {
    await this.client.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: 'Tricker <no-reply@tricker.com>',
      to: emailAddress,
      subject: 'Project Integration Denial',
      html: await prepareHtmlTemplate(path.join(__dirname, 'email-templates/declined_request.html'), variables),
    });
  }

  /**
   * Sends an acceptance email to the specified email address.
   * The email notifies the user that their project integration request has been accepted.
   * @param {string} emailAddress - The email address to which the acceptance email will be sent.
   * @param {IntegrationRequestEmailVariables} variables - The variables to be used in the email template.
   * @returns {Promise<void>} A Promise that resolves when the email is successfully sent.
   */
  async sendAcceptanceMail(emailAddress: string, variables: IntegrationRequestEmailVariables): Promise<void> {
    await this.client.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: 'Tricker <no-reply@tricker.com>',
      to: emailAddress,
      subject: 'Project Integration Access Granted',
      html: await prepareHtmlTemplate(path.join(__dirname, 'email-templates/access_granted.html'), variables),
    });
  }
}
