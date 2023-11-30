import { PubnubConnectionToBcelOne } from './pubnub-connection-bcel-one';
import { Command, CommandRunner } from 'nest-commander';
import { ModuleRef } from '@nestjs/core';

@Command({
  name: 'subscribe-bcel-one',
  arguments: '',
  description: 'Subscribe to Bcel One',
  options: { isDefault: false },
})
export class PubNubSubScribeBcelOneCommand extends CommandRunner {
  constructor(private moduleRef: ModuleRef) {
    super();
  }
  
  async run(): Promise<void> {
    const pubnubLottoConnectRepository = this.moduleRef.get(
        PubnubConnectionToBcelOne,
        { strict: false },
    );

    console.log('PUBNUB: Starting...');

    await pubnubLottoConnectRepository.subScribeToBcelOneChannel();
  }
}

// npm run command-nest subscribe-bcel-one