import { QueueProcessor } from './processor/default-queue.processor';
import { DEFAULT_QUEUE_SERVICE } from './../inject-key';
import { QueueNames } from '@/infrastructure/adapters/queue/bull/constants/queue.constants';
import { queueFactory } from '@/infrastructure/adapters/queue/bull/queue.factory';
import { BullModule } from '@nestjs/bull';
import { Global, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DefaultQueueService } from './service/default.service';


const providers: Provider[] = [
  {
    provide: DEFAULT_QUEUE_SERVICE,
    useClass: DefaultQueueService,
  }
];

@Global()
@Module({
  imports: [
    BullModule.registerQueueAsync(
      {
        name: 'defaultQueue',
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) =>
          queueFactory('defaultQueue', configService), // Corrected method
      }
    ),
  ],
  providers: [
    ...providers,
    QueueProcessor
  ],
  exports: providers,
})
export class QueueModule {}