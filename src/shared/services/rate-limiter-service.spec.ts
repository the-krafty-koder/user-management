import { RateLimiterService } from './rate-limiter.service';

describe('RateLimiterService', () => {
  let service: RateLimiterService;
  const phone = '+254234567890';

  beforeEach(() => {
    service = new RateLimiterService();
  });

  it('should allow the first request', () => {
    expect(service.isAllowed(phone)).toBe(true);
  });

  it('should allow up to the request limit', () => {
    for (let i = 0; i < 5; i++) {
      expect(service.isAllowed(phone)).toBe(true);
    }
  });

  it('should block requests exceeding the limit', () => {
    for (let i = 0; i < 5; i++) {
      service.isAllowed(phone);
    }
    expect(service.isAllowed(phone)).toBe(false);
  });

  it('should reset after the time window expires', () => {
    jest.useFakeTimers();
    for (let i = 0; i < 5; i++) {
      service.isAllowed(phone);
    }
    jest.advanceTimersByTime(70000);
    expect(service.isAllowed(phone)).toBe(true);
    jest.useRealTimers();
  });

  it('should track multiple phone numbers independently', () => {
    const phone2 = '+0987654321';
    for (let i = 0; i < 5; i++) {
      service.isAllowed(phone);
    }
    expect(service.isAllowed(phone)).toBe(false);
    expect(service.isAllowed(phone2)).toBe(true);
  });
});
