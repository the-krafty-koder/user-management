import { Test, TestingModule } from '@nestjs/testing';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { RateLimiterService } from '../shared/services/rate-limiter.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { WhatsappMessageDto } from './dto/message.dto';

describe('WebhookController', () => {
  let controller: WebhookController;
  let webhookService: WebhookService;
  let rateLimiterService: RateLimiterService;

  beforeEach(async () => {
    process.env.WEBHOOK_SECRET_TOKEN = 'secret-token';

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [
        {
          provide: WebhookService,
          useValue: {
            storeMessage: jest.fn().mockResolvedValue(undefined),
            generateReply: jest.fn().mockReturnValue({ text: 'Reply' }),
          },
        },
        {
          provide: RateLimiterService,
          useValue: {
            isAllowed: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<WebhookController>(WebhookController);
    webhookService = module.get<WebhookService>(WebhookService);
    rateLimiterService = module.get<RateLimiterService>(RateLimiterService);
  });

  it('should throw UnauthorizedException if Authorization header is missing', async () => {
    await expect(
      controller.handleWebhook('', {
        phone: '+1234567890',
      } as WhatsappMessageDto),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    await expect(
      controller.handleWebhook('Bearer invalid-token', {
        phone: '+1234567890',
      } as WhatsappMessageDto),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw BadRequestException if rate limit is exceeded', async () => {
    jest.spyOn(rateLimiterService, 'isAllowed').mockReturnValue(false);
    await expect(
      controller.handleWebhook('Bearer secret-token', {
        phone: '+254234567890',
      } as WhatsappMessageDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should store message and return generated reply', async () => {
    const result = await controller.handleWebhook('Bearer secret-token', {
      phone: '+254234567890',
    } as WhatsappMessageDto);
    expect(webhookService.storeMessage).toHaveBeenCalled();
    expect(result).toEqual({ text: 'Reply' });
  });

  it('should return success message if no reply is generated', async () => {
    jest.spyOn(webhookService, 'generateReply').mockReturnValue(null);
    const result = await controller.handleWebhook('Bearer secret-token', {
      phone: '+254234567890',
    } as WhatsappMessageDto);
    expect(result).toEqual({ message: 'Message processed successfully' });
  });
});
