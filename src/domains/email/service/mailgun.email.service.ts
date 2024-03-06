import { type IMailgunClient } from 'mailgun.js/Interfaces';
import process from 'process';
import { type EmailService } from '@domains/email/service/email.service';
import { promises as fs } from 'fs';
import { ConflictException } from '@utils';
import { type HtmlReplaceWords } from '@domains/integration/dto';

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

  async sendConfirmationMail(emailAddress: string, projectName: string): Promise<void> {
    await this.client.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: 'Tricker <no-reply@tricker.com>',
      to: emailAddress,
      subject: 'Project Integration Confirmation',
      html: await this.setDynamicWords('./src/utils/email-templates/project_integration_finished.html', [{ wordToReplace: '{{projectName}}', replacingWord: projectName }]),
    });
  }

  async sendDenialMail(emailAddress: string, projectName: string): Promise<void> {
    await this.client.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: 'Tricker <no-reply@tricker.com>',
      to: emailAddress,
      subject: 'Project Integration Confirmation',
      html: await this.setDynamicWords('./src/utils/email-templates/declined_request.html', [{ wordToReplace: '{{projectName}}', replacingWord: projectName }]),
    });
  }

  private async setDynamicWords(path: string, words: HtmlReplaceWords[]): Promise<string> {
    try {
      let html: string = await fs.readFile(path, 'utf8');
      for (const word of words) {
        html = html.replace(word.wordToReplace, word.replacingWord);
      }
      return html;
    } catch (err) {
      throw new ConflictException('Html conversion failed');
    }
  }
}
