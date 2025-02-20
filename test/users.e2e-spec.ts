import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { FirebaseService } from '../src/shared/firebase/firebase.service';

describe('UsersController (e2e) - Pagination', () => {
  let app: INestApplication;
  let firebaseService: FirebaseService;
  let mockFirestore: any;

  beforeAll(async () => {
    mockFirestore = {
      collection: jest.fn(() => ({
        orderBy: jest.fn(() => ({
          onSnapshot: jest.fn().mockResolvedValue(undefined),
          limit: jest.fn(() => ({
            get: jest.fn().mockResolvedValueOnce({
              docs: [
                {
                  id: 'user1',
                  data: () => ({ name: 'Alice', email: 'alice@example.com' }),
                },
                {
                  id: 'user2',
                  data: () => ({ name: 'Bob', email: 'bob@example.com' }),
                },
              ],
            }),
            startAfter: jest.fn(() => ({
              get: jest.fn().mockResolvedValue({ docs: [] }),
            })),
          })),
        })),
        doc: jest.fn(() => ({
          get: jest.fn(() => ({
            exists: true,
            startAfter: jest.fn().mockResolvedValue([]),
          })),
        })),
      })),
    };

    const mockFirebaseService = {
      getFirestore: jest.fn(() => mockFirestore),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FirebaseService)
      .useValue(mockFirebaseService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return paginated users (first page)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users?limit=2')
      .expect(200);

    expect(response.body).toEqual({
      users: [
        { id: 'user1', name: 'Alice', email: 'alice@example.com' },
        { id: 'user2', name: 'Bob', email: 'bob@example.com' },
      ],
      nextPageToken: 'user2',
    });
  });

  it('should return paginated users (second page)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users?limit=2&startAfter=user2')
      .expect(200);

    expect(response.body).toEqual({
      users: [],
      nextPageToken: undefined,
    });
  });
});
