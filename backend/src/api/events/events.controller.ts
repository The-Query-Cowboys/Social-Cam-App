import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Delete,
  Patch,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto, InviteUserDto } from './event.dto';

@Controller('/api/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async fetchEvents(@Query('publicOnly') publicOnly?: string) {
    const showPublicOnly = publicOnly === 'true';
    return this.eventsService.fetchEvents(showPublicOnly);
  }
  @Post()
  async createEvent(
    @Body()
    createEventDto: CreateEventDto,
  ): Promise<Event> {
    return this.eventsService.createEvent(createEventDto);
  }

  @Patch(':eventId')
  async updateEvent(
    @Param('eventId') eventId: string,
    @Body()
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventsService.updateEvent(parseInt(eventId), updateEventDto);
  }

  @Post(':eventId/invite')
  async inviteToEvent(
    @Param('eventId') eventId: string,
    @Body() inviteUserDto: InviteUserDto,
  ) {
    return this.eventsService.inviteUserToEvent(
      inviteUserDto.userId,
      parseInt(eventId, 10),
    );
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

  @Delete(':eventId')
  async deleteEvent(@Param('eventId') eventId: string) {
    return this.eventsService.deleteEvent(parseInt(eventId, 10));
  }

  @Delete(':eventId/invite/:userId')
  async deleteUserEvent(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
  ) {
    return this.eventsService.deleteUserEvent(
      parseInt(eventId, 10),
      parseInt(userId, 10),
    );
  }

  @Post(':eventId/schedule-notifications')
  async scheduleEventNotifications(@Param('eventId') eventId: string) {
    await this.eventsService.scheduleEventNotifications(parseInt(eventId, 10));
    return { success: true, message: 'Event notifications scheduled' };
  }

  @Get(':eventId')
  async fetchEventById(@Param('eventId') eventId: number) {
    return this.eventsService.fetchEventById(eventId);
  }

  @Get(':eventId/users')
  async fetchUsersByEventId(@Param('eventId') eventId: number) {
    return this.eventsService.fetchUsersByEventId(eventId);
  }
}
