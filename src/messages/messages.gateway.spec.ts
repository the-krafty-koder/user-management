import { Test, TestingModule } from '@nestjs/testing';
import { MessagesGateway } from './messages.gateway';
import { FirebaseService } from '../shared/firebase/firebase.service';
import { Server } from 'socket.io';

jest.mock('socket.io', () => {
  return {
    Server: jest.fn().mockImplementation(() => ({
      emit: jest.fn(),
    })),
  };
});

describe('MessagesGateway', () => {
  let gateway: MessagesGateway;
  let firebaseService: FirebaseService;
  let server: Server;

  const mockFirebaseService = {
    getFirestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        orderBy: jest.fn(() => ({
          onSnapshot: jest.fn((callback) => {
            const mockSnapshot = {
              docs: [
                {
                  id: '1',
                  data: () => ({ message: 'Hello', phone: '+12345' }),
                },
                {
                  id: '2',
                  data: () => ({ message: 'World', phone: '+67890' }),
                },
              ],
            };
            callback(mockSnapshot);
          }),
        })),
      })),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesGateway,
        { provide: FirebaseService, useValue: mockFirebaseService },
      ],
    }).compile();

    gateway = module.get<MessagesGateway>(MessagesGateway);
    firebaseService = module.get<FirebaseService>(FirebaseService);
    server = new Server();
    gateway.server = server;
    gateway.onModuleInit();
  });

  it('should initialize Firestore on module init', () => {
    expect(mockFirebaseService.getFirestore).toHaveBeenCalled();
  });

  it('should emit messages on Firestore snapshot change', () => {
    gateway.afterInit(server);

    expect(server.emit).toHaveBeenCalledWith('messages', [
      { id: '1', message: 'Hello', phone: '+12345' },
      { id: '2', message: 'World', phone: '+67890' },
    ]);
  });
});
