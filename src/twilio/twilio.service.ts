import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';


@Injectable()
export class TwilioService {
    private twilioClient: twilio.Twilio;

    constructor() {
        this.twilioClient = new twilio.Twilio('ACb27944214d2e65dd282997da415892d6', 'f79eaa66df965cdf111c36128678496f');
    }
    
    async sendSMS(): Promise<any> {
        try {
            const message = await this.twilioClient.messages.create({
                body: 'Your OTP: 0299382',
                from: '+17544006915',
                to: '+8562076226948',
            });
            // console.log(message);
            return { message: 'SMS sent successfully' };
        } catch (error) {
            // console.error('Failed to send SMS:', error);
            throw error;
        }
    }

    async sendOTP(): Promise<any> {
        const serviceSid = 'VA34e7d751af8430176b9462dfb81c9656';

        try {
            await this.twilioClient.verify.v2
            .services(serviceSid)
            .verifications.create({ to: '+8562076226948', channel: 'sms' });

            return { message: 'Send OTP successfully' };
        } catch (error) {
            console.error('Error Send OTP:', error.message);

            return { error: 'Failed to Send OTP' };
        }
    }

    async verifyOTP(code): Promise<any> {
        const serviceSid = 'VA34e7d751af8430176b9462dfb81c9656';

        try {
            const res = await this.twilioClient.verify.v2
                .services(serviceSid)
                .verificationChecks.create({ to: '+8562076226948', code });
            
            if (res.valid) {
                return { message: 'Verify OTP successfully.' };
            }
            return { message: 'OTP invalid.' };
        } catch (error) {
            console.error('Error verifying OTP:', error.message);

            return { error: 'Failed to verify OTP' };
        }
    }
}
