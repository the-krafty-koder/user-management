import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { FirebaseService } from '../src/shared/firebase/firebase.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let mockFirestore: any;

  beforeEach(async () => {
    mockFirestore = {
      collection: jest.fn(() => ({
        orderBy: jest.fn(() => ({
          onSnapshot: jest.fn().mockResolvedValue(undefined),
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

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
