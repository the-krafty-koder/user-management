import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { FirestoreExceptionFilter } from './shared/filters/firestore-exception.filter';
import { BadRequestFilter } from './shared/filters/bad-request.filter';

async function bootstrap() {
  dotenv.config({ path: path.join(__dirname, '..', '.env') });
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new FirestoreExceptionFilter(), new BadRequestFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
