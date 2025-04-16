import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationProcessor } from './notification.processor';
import { NotificationQueueEvents } from './notification.queue-events';
import { ExpoNotificationService } from './expo-notification.service';
import { NotificationService } from './notifications.service';
import { PrismaService } from '../../prisma.service';

const isTest = process.env.NODE_ENV === 'test';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
      // Queue-specific settings
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: 100,
      },
    }),
  ],
  providers: [
    ...(!isTest ? [NotificationProcessor] : []),
    NotificationQueueEvents,
    ExpoNotificationService,
    NotificationService,
    PrismaService,
  ],
  exports: [
    BullModule, // Export the queue so other modules can access it
    ExpoNotificationService, // Export the notification service for other modules
    NotificationService, // Export the job scheduling service
  ],
})
export class NotificationsModule {}
