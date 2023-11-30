import { FirebaseMiddleware } from './middlewares/otp.middleware';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import {
  I18nMiddleware,
  I18nValidationExceptionFilter,
  I18nValidationPipe,
} from 'nestjs-i18n';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  dotenv.config();  // config dotenv
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);


  /** Set Enable Cors */
  app.enableCors({ origin: '*' });      
  app.use(I18nMiddleware);
  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: true,
    }),
  );
  app.setGlobalPrefix('api'); // set global prefix path is api

  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/public/' });

  /** Setting Swagger */
    const config = new DocumentBuilder()
      .setTitle('My Project@2023')
      .setDescription('The cats API description')
      .setVersion('1.0')
      .addTag('Porject 2023!')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  /** End Swagger */

  /** Firebase */
    // const serviceAccount = require('../vari-2f1aa-firebase-adminsdk-g8bl7-fe871e96ae.json');
    const serviceAccount = require('../halogistics-ec30b-firebase-adminsdk-2eqk8-0766a77117.json');
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    // app.use(new FirebaseMiddleware().use);
  /** End Firebase */

  await app.listen(process.env.PORT);
}
bootstrap();