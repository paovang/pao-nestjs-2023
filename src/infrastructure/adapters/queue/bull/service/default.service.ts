import { ICache } from '@/infrastructure/ports/cache/cache.interface';
import { IDefualtQueue } from '@/infrastructure/ports/queue/default-queue.interface';
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CACHE_SERVICE } from '../../../cache-manager/inject-key';

@Injectable()
export class DefaultQueueService<Payload> implements IDefualtQueue<Payload> {
    constructor(
        @InjectQueue('defaultQueue') private readonly queue: Queue,
        @Inject(CACHE_SERVICE) private readonly cacheService: ICache<any>,
    ) {}

    async addJob(
        jobName: string,
        data: Payload,
        cacheTTL = 86400000,
    ): Promise<void> {
        try {
            const jobIdentifier = this.cacheService.generateJobIdentifier(
                jobName,
                data,
            );
            const existingJob = await this.cacheService.get(jobIdentifier);
            if (existingJob) {
                return;
            }
            
            await this.queue.add(jobName, data);
            await this.cacheService.set(jobIdentifier, true, cacheTTL);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred';
            console.log('error: ', message);

            // throw new CustomException('FAILED_TO_ADD_JOB_TO_QUEUE', 500, 'error', {
            //     message: message,
            // });
        }
    }
}