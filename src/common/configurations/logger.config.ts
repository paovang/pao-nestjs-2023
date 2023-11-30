import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');

type Environment = 'development' | 'production';

export function createLogger(configService: ConfigService) {
  const env: Environment =
    (configService.get<string>('NODE_ENV', 'development') as Environment) ||
    'development';

  return winston.createLogger({
    level: configService.get<string>(
      'LOG_LEVEL',
      env === 'production' ? 'info' : 'debug',
    ),
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const symbolicKeys = Object.getOwnPropertySymbols(meta);
        symbolicKeys.forEach((key) => {
          meta[key.toString()] = meta[key];
        });
        const filteredMeta = Object.keys(meta).reduce((acc, key) => {
          if (['password', 'secret'].includes(key)) {
            acc[key] = 'FILTERED';
          } else {
            acc[key] = meta[key];
          }
          return acc;
        }, {} as Record<string, unknown>);

        let traceString = '';
        if (typeof filteredMeta.trace === 'string') {
          traceString = filteredMeta.trace
            .split('\n')
            .map((line, index) => `#${index} ${line.trim()}`)
            .join('\n');
          delete filteredMeta.trace;
        }

        if (meta['Symbol(splat)']) {
          filteredMeta.errorDetail = meta['Symbol(splat)'][0];
          delete filteredMeta['Symbol(splat)'];
        }

        const metaString = JSON.stringify(filteredMeta, null, 2).replace(
          /\\n/g,
          '\n',
        );

        return `[${timestamp}] ${env.toUpperCase()}.${level.toUpperCase()}: ${message} ${metaString} ${
          traceString ? `\n"trace":\n${traceString}` : ''
        }`;
      }),
      winston.format.colorize(),
    ),
    transports: [
      new DailyRotateFile({
        dirname: configService.get<string>('LOG_PATH', 'storage/logs'),
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        handleExceptions: true,
      }),
      ...(env !== 'production'
        ? [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
              ),
            }),
          ]
        : []),
    ],
  });
}