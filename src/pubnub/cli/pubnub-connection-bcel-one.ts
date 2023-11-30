import { Injectable } from '@nestjs/common';
const PubNub = require('pubnub');

@Injectable()
export class PubnubConnectionToBcelOne {
    private readonly _pubnub;
    
    constructor() {
      this._pubnub = new PubNub({
        publishKey: process.env.BCEL_ONE_PUBLISH_KEY,
        subscribeKey: process.env.BCEL_ONE_SUBSCRIBE_KEY,
        secretKey: process.env.BCEL_ONE_PUBNUB_SECRET_KEY,
        uuid: process.env.BCEL_ONE_PUBNUB_UUID, 
      });
    }

    getPubNubInstance() {
      return this._pubnub;
    }

    async subScribeToBcelOneChannel(): Promise<any> {
      const oneHourAgo = Math.floor((new Date().getTime() / 1000) - (3600 * 1));
      
      this._pubnub.subscribe({
        channels: [process.env.BCEL_ONE_CHANNEL],
        withPresence: false,
        timetoken: oneHourAgo,
      });

      console.log('PUBNUB: Subscribe Completed...');

      this._pubnub.addListener({
        message: async (message: any) => {
          try {
            const jsonMessageBody = JSON.parse(message['message']);

            // const order_number = jsonMessageBody['uuid'];
            // const total_paid_amount = jsonMessageBody['amount'];
            // const txtTime = moment(
            //   jsonMessageBody['txtime'],
            //   'DD/MM/YYYY HH:mm:ss',
            // ).toDate();
            
            console.log(jsonMessageBody);
          } catch (err: unknown) {
            console.log(err);
          }
        }
      });
    }
}