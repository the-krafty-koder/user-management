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
            process.env.FIREBASE_SERVICE_ACCOUNT_KEY!,
          ),
        });
      } catch (error) {
        console.error('Firebase initialization error:', error);
        throw error;
      }
    }
    this.db = admin.firestore();
  }

  getFirestore() {
    return this.db;
  }
}
