import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private db: FirebaseFirestore.Firestore;

  onModuleInit() {
    if (!admin.apps.length) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert(
            process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
              '../../../credentials/firebase-adminsdk.json',
          ),
        });
      } catch (error) {
        console.error('Firebase initialization error:', error);
        throw error;
      }
    }
    this.db = admin.firestore();
    console.log(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  }

  getFirestore() {
    return this.db;
  }
}
