import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { FirebaseService } from '../shared/firebase/firebase.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';

export interface MockFirestore {
  collection: jest.Mock;
  where: jest.Mock;
  get: jest.Mock;
  add: jest.Mock;
}

describe('UsersService', () => {
  let usersService: UsersService;
  let mockFirestore: MockFirestore;

  beforeEach(async () => {
    mockFirestore = {
      collection: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      get: jest.fn(),
      add: jest.fn(),
    };

    const mockFirebaseService = {
      getFirestore: jest.fn(() => mockFirestore),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: FirebaseService, useValue: mockFirebaseService },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersService.onModuleInit();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should throw BadRequestException if email already exists', async () => {
    mockFirestore.get.mockResolvedValue({ empty: false });
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+15551234567',
    };
    await expect(usersService.create(createUserDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should create a new user and return user data', async () => {
    mockFirestore.get.mockResolvedValue({ empty: true });
    const mockUserRef = {
      get: jest.fn().mockResolvedValue({
        id: '123',
        data: () => ({
          name: 'Test User',
          email: 'test@example.com',
          phone: '+15551234567',
        }),
      }),
    };
    mockFirestore.add.mockResolvedValue(mockUserRef);

    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+15551234567',
    };
    const result = await usersService.create(createUserDto);

    expect(result).toEqual({
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      phone: '+15551234567',
    });
  });
});
