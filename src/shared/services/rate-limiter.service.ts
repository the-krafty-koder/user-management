import { Injectable } from '@nestjs/common';

@Injectable()
export class RateLimiterService {
  private readonly requestCounts: Map<
    string,
    { count: number; timestamp: number }
  > = new Map();
  private readonly requestLimit = 5;
  private readonly timeWindow = 60 * 1000;

  isAllowed(phone: string): boolean {
    const now = Date.now();
    const requestData = this.requestCounts.get(phone);

    if (requestData) {
      if (now - requestData.timestamp > this.timeWindow) {
        // Time window expired, reset count
        this.requestCounts.set(phone, { count: 1, timestamp: now });
        return true;
      }

      if (requestData.count < this.requestLimit) {
        this.requestCounts.set(phone, {
          count: requestData.count + 1,
          timestamp: now,
        });
        return true;
      }

      // Request limit exceeded
      return false;
    }

    // First request from this phone number
    this.requestCounts.set(phone, { count: 1, timestamp: now });
    return true;
  }
}
