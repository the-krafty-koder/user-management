import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Headers,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WhatsappMessageDto } from './dto/message.dto';
import { RateLimiterService } from '../shared/services/rate-limiter.service';

@Controller('webhook')
export class WebhookController {
  private readonly SECRET_TOKEN = process.env.WEBHOOK_SECRET_TOKEN;

  constructor(
    private readonly webhookService: WebhookService,
    private readonly rateLimiterService: RateLimiterService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async handleWebhook(
    @Headers('Authorization') authHeader: string,
    @Body() message: WhatsappMessageDto,
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];
    if (token !== this.SECRET_TOKEN) {
      throw new UnauthorizedException('Invalid token');
    }

    if (!this.rateLimiterService.isAllowed(message.phone)) {
      throw new BadRequestException('Rate limit exceeded');
    }

    await this.webhookService.storeMessage(message);

    const reply = this.webhookService.generateReply(message);
    if (reply) {
      return reply;
    }

    return { message: 'Message processed successfully' };
  }
}
