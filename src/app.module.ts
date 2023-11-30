import { LoggerModule } from '@/infrastructure/adapters/logger/winston/logger.module';
import { MailModule } from '@/infrastructure/adapters/mail/mail.module';
import { QueueModule } from '@/infrastructure/adapters/queue/bull/queue.module';
import { I18nModule } from '@/infrastructure/adapters/localization/i18n.module';
import { TasksService } from '@/infrastructure/adapters/schedule/task.service';
import { TypeOrmRepositoryModule } from './infrastructure/adapters/repositories/typeorm/typeorm-repository.module';
import { CacheManagerModule } from '@/infrastructure/adapters/cache-manager/redis/cache.module';
import { FirebaseMiddleware } from './middlewares/otp.middleware';
import { LoginService } from './ldb-payment/ldb-login.service';
import { PubnubConnectionToBcelOne } from './pubnub/cli/pubnub-connection-bcel-one';
import { runners } from './cli/index';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { TwilioService } from './twilio/twilio.service';
import { PubnubService } from './pubnub/pubnub.service';
import { BcelOneService } from './bcel-one/bcel-one.service';
import { LdbPaymentService } from './ldb-payment/ldb-payment.service';
import { NotificationFirebaseService } from './notification-firebase/notification-firebase.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    LoggerModule.forRootAsync(),
    I18nModule,
    ScheduleModule.forRoot(),
    TypeOrmRepositoryModule,
    CacheManagerModule,
    QueueModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env', '.env.development', '.env.production'],
    }),
    AuthModule,
    UsersModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    TwilioService, 
    PubnubService, 
    BcelOneService,
    PubnubConnectionToBcelOne,
    LdbPaymentService,
    LoginService,
    NotificationFirebaseService,
    ...runners,
    // TasksService
  ]
})
export class AppModule {}
