import { Injectable, OnModuleInit } from '@nestjs/common';
import { WhatsappMessageDto } from './dto/message.dto';
import { FirebaseService } from '../shared/firebase/firebase.service';

@Injectable()
export class WebhookService implements OnModuleInit {
  private db: FirebaseFirestore.Firestore;

  constructor(private readonly firebaseService: FirebaseService) {}

  onModuleInit() {
    this.db = this.firebaseService.getFirestore();
  }

  async storeMessage(message: WhatsappMessageDto) {
    await this.db.collection('messages').add({
      message: message.message,
      phone: message.phone,
      timestamp: new Date(),
    });
  }

  generateReply(message: WhatsappMessageDto) {
    if (message.message.toLowerCase().includes('help')) {
      return { reply: 'Support contact: support@company.com' };
    }
    return null;
  }
}
