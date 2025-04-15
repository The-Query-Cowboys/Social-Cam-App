import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(
    @Body()
    eventData: {
      event_owner_id: number;
      event_title: string;
      event_description: string;
      storage_id: string;
      album_id: number;
      event_date: string | Date;
      event_date_end: string | Date;
      album_delay?: number;
      event_location: string;
      private: boolean;
    },
  ) {
    return this.eventsService.createEvent(eventData);
  }

  @Post(':eventId/invite')
  async inviteToEvent(
    @Param('eventId') eventId: string,
    @Body('userId') userId: number,
  ) {
    return this.eventsService.inviteUserToEvent(userId, parseInt(eventId, 10));
  }

  @Patch(':eventId/users/:userId/status')
  async updateUserEventStatus(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
    @Body('statusId') statusId: number,
  ) {
    if (![1, 2, 3].includes(statusId)) {
      throw new BadRequestException('Invalid status ID');
    }
    return this.eventsService.updateUserEventStatus(
      parseInt(userId, 10),
      parseInt(eventId, 10),
      statusId,
    );
  }

  @Post(':eventId/schedule-notifications')
  async scheduleEventNotifications(@Param('eventId') eventId: string) {
    await this.eventsService.scheduleEventNotifications(parseInt(eventId, 10));
    return { success: true, message: 'Event notifications scheduled' };
  }
}
