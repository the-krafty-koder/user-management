import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { FirebaseService } from '../shared/firebase/firebase.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessagesGateway implements OnGatewayInit, OnModuleInit {
  @WebSocketServer() server: Server;
  private db: FirebaseFirestore.Firestore;

  constructor(private readonly firebaseService: FirebaseService) {}

  onModuleInit() {
    this.db = this.firebaseService.getFirestore();
    this.setupFirestoreListener();
  }

  afterInit(server: Server) {}

  private setupFirestoreListener() {
    this.db
      .collection('messages')
      .orderBy('timestamp')
      .onSnapshot((snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.server.emit('messages', messages);
      });
  }
}
