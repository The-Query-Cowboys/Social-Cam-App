import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma.service';
import { CreateEventDto, UpdateEventDto, InviteUserDto } from './event.dto';
//import { AlbumService } from '../albums.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectQueue('notifications') private notificationsQueue: Queue,
    private prisma: PrismaService,
  ) { }

  async fetchEvents() {
    return this.prisma.event.findMany();
  }

  async fetchEventById(eventId) {
    const event = await this.prisma.event.findUnique({
      where: { event_id: eventId },
    });
    if (!event) {
      throw new NotFoundException(`Event_id ${eventId} was not found`);

    }
    return event;
  }

  async fetchUsersByEventId(eventId) {
    const users = await this.prisma.user.findMany({
        where: {
            UserEvent: {
                some: {
                    event_id: eventId,
                },
            },
        },
    })

    if (users.length === 0) {
      throw new NotFoundException(`No users are linked to eventId: ${eventId}`);

    }
    return users;
  }

  async createEvent(createEventDto: CreateEventDto): Promise<any> {
    if (
      createEventDto.event_date &&
      createEventDto.event_date_end &&
      new Date(createEventDto.event_date) >
      new Date(createEventDto.event_date_end)
    ) {
      throw new BadRequestException('Event end date must be after start date');
    }

    if (createEventDto.album_delay && createEventDto.album_delay < 0) {
      throw new BadRequestException('Album delay cannot be negative');
    }

    const album = await this.prisma.album.create({
      data: { album_name: createEventDto.event_title },
    });
    try {
      const newEvent = await this.prisma.event.create({
        data: {
          event_owner_id: createEventDto.event_owner_id,
          event_title: createEventDto.event_title,
          event_description: createEventDto.event_description,
          storage_id: createEventDto.storage_id,
          album_id: album.album_id,
          event_date: createEventDto.event_date
            ? new Date(createEventDto.event_date)
            : new Date(),
          event_date_end: createEventDto.event_date_end
            ? new Date(createEventDto.event_date_end)
            : new Date(),
          album_delay: createEventDto.album_delay ?? 0,
          event_location: createEventDto.event_location,
          private: createEventDto.private,
        },
      });
      return newEvent;
    } catch (error) {
      console.error('Could not create event', error);
      throw error;
    }
  }

  async updateEvent(
    eventId: number,
    updateEventDto: UpdateEventDto,
  ): Promise<any> {
    const existingEvent = await this.prisma.event.findUnique({
      where: { event_id: eventId },
    });

    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Validate dates if both are provided

    const startDateStr = updateEventDto.event_date || existingEvent.event_date;
    const endDateStr =
      updateEventDto.event_date_end || existingEvent.event_date_end;

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (startDate > endDate) {
      throw new BadRequestException('End date cannot be before start date');
    }

    const updatedEvent = await this.prisma.event.update({
      where: { event_id: eventId },
      data: updateEventDto,
    });

    if (updateEventDto.event_date || updateEventDto.event_date_end) {
      // Cancel any existing scheduled notifications
      await this.cancelEventNotifications(eventId);
      // Re-schedule notifications with new dates
      await this.scheduleEventNotifications(eventId);
    }

    return updatedEvent;
  }

  async inviteUserToEvent(userId: number, eventId: number): Promise<any> {
    const event = await this.prisma.event.findUnique({
      where: { event_id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return this.prisma.userEvent.create({
      data: {
        user_id: userId,
        event_id: eventId,
        status_id: 1,
      },
    });
  }

  async updateUserEventStatus(
    userId: number,
    eventId: number,
    statusId: number,
  ): Promise<any> {
    try {
      const userEvent = await this.prisma.userEvent.findFirst({
        where: {
          user_id: userId,
          event_id: eventId,
        },
      });

      if (!userEvent) {
        throw new NotFoundException(
          `User with ID ${userId} is not associated with event ${eventId}`,
        );
      }

      if (userEvent.status_id === 3 && statusId !== 3) {
        throw new BadRequestException(
          'Cannot change status from "attended" to another status',
        );
      }
      return this.prisma.userEvent.update({
        where: {
          userEvent_id: userEvent.userEvent_id,
        },
        data: {
          status_id: statusId,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async confirmEventAttendance(userId: number, eventId: number): Promise<any> {
    return this.updateUserEventStatus(userId, eventId, 2);
  }

  async cancelEventAttendance(userId: number, eventId: number): Promise<any> {
    return this.updateUserEventStatus(userId, eventId, 1);
  }

  async markUserAttended(userId: number, eventId: number): Promise<any> {
    return this.updateUserEventStatus(userId, eventId, 3);
  }

  async scheduleEventNotifications(eventId: number): Promise<void> {
    const event = await this.prisma.event.findUnique({
      where: { event_id: eventId },
    });

    if (!event) {
      throw new Error(`Event with ID ${eventId} not found`);
    }

    // Schedule event start notification
    await this.scheduleEventStartNotification(event);

    // Schedule event end notification
    await this.scheduleEventEndNotification(event);
  }

  private async scheduleEventStartNotification(event: any): Promise<void> {
    const delayMs = Math.max(
      0,
      new Date(event.event_date).getTime() - Date.now(),
    );

    await this.notificationsQueue.add(
      'eventStart',
      {
        eventId: event.event_id,
        eventTitle: event.event_title,
      },
      {
        delay: delayMs,
        attempts: 3,
        removeOnComplete: true,
      },
    );
  }

  async deleteEvent(eventId: number): Promise<any> {
    // First check if the event exists

    if (isNaN(eventId) || !Number.isInteger(eventId) || eventId <= 0) {
      throw new BadRequestException(
        'Event ID must be a valid positive integer',
      );
    }
    const existingEvent = await this.prisma.event.findUnique({
      where: { event_id: eventId },
    });
    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    try {
      await this.cancelEventNotifications(eventId);

      await this.prisma.userEvent.deleteMany({
        where: { event_id: eventId },
      });

      await this.prisma.comment.deleteMany({
        where: { event_id: eventId },
      });

      const deletedEvent = await this.prisma.event.delete({
        where: { event_id: eventId },
      });

      return {
        message: 'Event deleted successfully',
        event_id: deletedEvent.event_id,
      };
    } catch (error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }
  }

  async deleteUserEvent(eventId: number, userId: number) {
    if (isNaN(eventId) || !Number.isInteger(eventId) || eventId <= 0) {
      throw new BadRequestException(
        'Event ID must be a valid positive integer',
      );
    }
    if (isNaN(userId) || !Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException('User ID must be a valid positive integer');
    }
    const existingUserEvent = await this.prisma.userEvent.findFirst({
      where: {
        event_id: eventId,
        user_id: userId,
      },
    });

    if (!existingUserEvent) {
      throw new NotFoundException(
        `User Event with user ID ${userId} and event ID ${eventId} was not found`,
      );
    }

    try {
      await this.prisma.userEvent.delete({
        where: { userEvent_id: existingUserEvent.userEvent_id },
      });

      return {
        message: 'User removed from event successfully',
      };
    } catch (error) {
      throw new Error(`Failed to remove user from event: ${error.message}`);
    }
  }

  private async scheduleEventEndNotification(event: any): Promise<void> {
    const delayMs = Math.max(
      0,
      new Date(event.event_date_end).getTime() - Date.now(),
    );

    await this.notificationsQueue.add(
      'eventEnd',
      {
        eventId: event.event_id,
        eventTitle: event.event_title,
      },
      {
        delay: delayMs,
        attempts: 3,
        removeOnComplete: true,
      },
    );
  }
  async cancelEventNotifications(eventId: number): Promise<void> {
    try {
      const jobs = await this.notificationsQueue.getJobs([
        'delayed',
        'waiting',
      ]);

      for (const job of jobs) {
        if (job.data.eventId === eventId) {
          await job.remove();
        }
      }
    } catch (error) {
      throw error;
    }
  }
}