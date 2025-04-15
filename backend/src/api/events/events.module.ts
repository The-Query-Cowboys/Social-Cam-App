import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { NotificationProcessor } from './notification.processor';
import { NotificationQueueEvents } from './notification.queue-events';
import { PrismaService } from '../../prisma.service';
import { ExpoNotificationService } from '../notifications/expo-notification.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  controllers: [EventsController],
  providers: [
    EventsService,
    NotificationProcessor,
    NotificationQueueEvents,
    PrismaService,
    ExpoNotificationService,
  ],
})
export class EventsModule {}
