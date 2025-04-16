import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaService } from '../../prisma.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    NotificationsModule, // Import the shared NotificationsModule
  ],
  controllers: [EventsController],
  providers: [EventsService, PrismaService],
})
export class EventsModule {}
