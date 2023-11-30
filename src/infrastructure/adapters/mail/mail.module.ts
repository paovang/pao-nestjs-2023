import { mailerConfig } from '@/common/configurations/mailer.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mailProvider } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: mailerConfig,
      inject: [ConfigService],
    }),
  ],
  providers: [mailProvider],
  exports: [mailProvider],
})
export class MailModule {}