import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { JobNames } from '../constants/queue.constants';

@Processor('defaultQueue')
export class QueueProcessor {
  constructor(
   
  ) {}

  @Process({ name: JobNames.SendMail })
  async sendMail(job: Job<any>) {
    console.log('successful: ', job.data);
  }
}