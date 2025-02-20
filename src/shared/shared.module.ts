import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './firebase/firebase.service';
import { RateLimiterService } from './services/rate-limiter.service';

@Global()
@Module({
  providers: [FirebaseService, RateLimiterService],
  exports: [FirebaseService, RateLimiterService],
})
export class SharedModule {}
