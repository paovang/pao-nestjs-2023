import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Module({})
export class FirebaseModule {
  static register(): admin.app.App {
    const serviceAccount = require('../../halogistics-ec30b-firebase-adminsdk-2eqk8-0766a77117.json');

    const firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: '', // replace with your database URL
    });

    return firebaseApp;
  }
}