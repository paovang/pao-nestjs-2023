import { i18nConfigFactory } from '@/common/configurations/localization.config';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule as NestI18nModule,
  QueryResolver,
} from 'nestjs-i18n';

const LOCALE_KEY = ['locale', 'lang', 'x-lang'];

@Global()
@Module({
  imports: [
    NestI18nModule.forRootAsync({
      inject: [ConfigService],
      useFactory: i18nConfigFactory,
      resolvers: [ 
        new QueryResolver(LOCALE_KEY),
        new HeaderResolver(LOCALE_KEY),
        AcceptLanguageResolver,
      ],
    }),
  ],
  exports: [NestI18nModule],
})
export class I18nModule {}