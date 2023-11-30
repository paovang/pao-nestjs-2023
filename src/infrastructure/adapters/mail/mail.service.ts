import {
  IMail,
  SendMailOptions,
} from '@/infrastructure/ports/mail/mail.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MAIL_SERVICE } from './inject-key';

@Injectable()
export class MailService<Context> implements IMail<Context> {
  constructor(
    private _mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  async sendMail({
    to,
    subject,
    template,
    context,
  }: SendMailOptions<Context>): Promise<void> {
    const data = await this._mailerService.sendMail({
      from: this.config.get('MAIL_FROM'),
      to,
      subject,
      template: './' + 'forgot-password',
      context, 
      attachments: [
        {
          filename: 'logo.png',
          path: __dirname + '/templates/images/logo.png',
          cid: 'logo', 
        },
      ],
    });

    console.log('data: ', data);
  }
}

export const mailProvider: Provider = {
  provide: MAIL_SERVICE,
  useClass: MailService,
};