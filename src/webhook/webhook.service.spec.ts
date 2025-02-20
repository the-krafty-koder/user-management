import { Test, TestingModule } from '@nestjs/testing';
import { WebhookService } from './webhook.service';
import { FirebaseService } from '../shared/firebase/firebase.service';
import { WhatsappMessageDto } from './dto/message.dto';

describe('WebhookService', () => {
  let service: WebhookService;
  let firebaseService: FirebaseService;
  let mockFirestore: any;
  let mockAdd: any;

  beforeEach(async () => {
    mockAdd = jest.fn().mockResolvedValue(undefined);

    mockFirestore = {
      collection: jest.fn(() => ({ add: mockAdd })),
    };

    const mockFirebaseService = {
      getFirestore: jest.fn(() => mockFirestore),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        { provide: FirebaseService, useValue: mockFirebaseService },
      ],
    }).compile();

    service = module.get<WebhookService>(WebhookService);
    firebaseService = module.get<FirebaseService>(FirebaseService);
    service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should store a message in Firestore', async () => {
    const message: WhatsappMessageDto = {
      phone: '+1234567890',
      message: 'Hello',
    };
    await service.storeMessage(message);
    expect(mockFirestore.collection).toHaveBeenCalledWith('messages');
    expect(mockAdd).toHaveBeenCalledWith({
      message: 'Hello',
      phone: '+1234567890',
      timestamp: expect.any(Date),
    });
  });

  it('should generate a reply for help messages', () => {
    const message: WhatsappMessageDto = {
      phone: '+1234567890',
      message: 'help',
    };
    expect(service.generateReply(message)).toEqual({
      reply: 'Support contact: support@company.com',
    });
  });
});
