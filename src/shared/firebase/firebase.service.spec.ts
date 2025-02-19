import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseService } from './firebase.service';
import * as admin from 'firebase-admin';

jest.mock('firebase-admin', () => {
  const mockFirestore = {
    // Mock Firestore methods as needed for your tests
    collection: jest.fn().mockReturnThis(), // Example: Mock collection()
    doc: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({ exists: true, data: () => ({}) }), // Example: Mock get()
    add: jest.fn().mockResolvedValue({ id: 'mockId' }),
  };

  return {
    initializeApp: jest.fn(),
    credential: {
      cert: jest.fn(),
    },
    firestore: jest.fn(() => mockFirestore),
    apps: { length: 0 }, // Simulate not being initialized
  };
});

describe('FirebaseService', () => {
  let service: FirebaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseService],
    }).compile();

    service = module.get<FirebaseService>(FirebaseService);
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize Firebase on module init', () => {
    expect(admin.initializeApp).toHaveBeenCalled();
    expect(admin.firestore).toHaveBeenCalled();
  });

  it('should return the Firestore instance', () => {
    const db = service.getFirestore();
    expect(db).toBeDefined();
  });
});
