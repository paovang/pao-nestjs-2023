import { Injectable } from '@nestjs/common';
const PubNub = require('pubnub');

@Injectable()
export class PubnubService {
    private readonly _pubnub;
    
    constructor() {
      this._pubnub = new PubNub({
        publishKey: process.env.PUBNUB_PUBLISH_KEY,
        subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
        secretKey: process.env.PUBNUB_SECRET_KEY,
        uuid: process.env.PUNUB_UUID, // Corrected UUID format
      });
    }

    async publishMessage(channel: string, message: any): Promise<void> {
      try {
        console.log(`trying to publish message ${channel}}`);
        await this._pubnub.publish({
          channel: 'Channel-Pao',
          message: message,
        });
      } catch (err: unknown) {
        console.log('Error publishing message:', err);
      }
    }

    async subScribeToShopChannel(): Promise<any> {
      this._pubnub.subscribe({
        channels: ['Channel-Pao'],
        withPresence: false,
      });

      this._pubnub.addListener({
        message: async (message: any) => {
          try {
            console.log(message.message);
          } catch (err: unknown) {
            console.log(err);
          }
        },
      });
    }
}