import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationFirebaseService {
    private readonly options = {
        priority: 'high',
        timeToLive: 60 * 60 * 24,
    };
    
    private readonly optionsSilent = {
        priority: 'high',
        timeToLive: 60 * 60 * 24,
        content_available: true,
    };

    async sendNotificationFirebase(token: string, body: string) {
        const payload: admin.messaging.MessagingPayload = {
            notification: {
                title: 'welcome to laos.',
                body,
            },
        }
        const silent = true;

        try {
            const response = await admin.messaging().sendToTopic(
                token, 
                payload,
                silent ? this.optionsSilent : this.options,
            );
            return response;
        } catch (error) {
            console.error('Error sending notification:', error);
            throw error;
        }
    }
}
