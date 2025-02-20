import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { WebhookModule } from './webhook/webhook.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [SharedModule, UsersModule, WebhookModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
