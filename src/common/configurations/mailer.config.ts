import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const mailerConfig = (config: ConfigService): MailerOptions => ({
  transport: {
    host: config.get('MAIL_HOST'),
    port: Number(config.get('MAIL_PORT')),
    auth: {
      user: config.get('MAIL_USER'),
      pass: config.get('MAIL_PASSWORD'),
    },
  },
  defaults: {
    from: `"No Reply" <${config.get('MAIL_FROM')}>`,
  },
  template: {
    dir: join(__dirname + '../../../infrastructure/adapters/mail/templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true, 
    },
  },
});