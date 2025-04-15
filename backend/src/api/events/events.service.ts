import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma.service';
//import { AlbumService } from '../albums.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectQueue('notifications') private notificationsQueue: Queue,
    private prisma: PrismaService,
  ) {}

  async fetchEvents() {
    console.log('fetching events in service');
    return this.prisma.event.findMany();
  }
  async createEvent(eventData: {
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
  }): Promise<any> {
    const event_date =
      typeof eventData.event_date === 'string'
        ? new Date(eventData.event_date)
        : eventData.event_date;

    const event_date_end =
      typeof eventData.event_date_end === 'string'
        ? new Date(eventData.event_date_end)
        : eventData.event_date_end;

    if (event_date_end < event_date) {
      throw new BadRequestException('End date cannot be before start date');
    }

    const newEvent = await this.prisma.event.create({
      data: {
        event_owner_id: eventData.event_owner_id,
        event_title: eventData.event_title,
        event_description: eventData.event_description,
        storage_id: eventData.storage_id,
        album_id: eventData.album_id,
        event_date,
        event_date_end,
        album_delay: eventData.album_delay ?? 0,
        event_location: eventData.event_location,
        private: eventData.private,
      },
    });

    return newEvent;
  }

  async updateEvent(
    eventId: number,
    updateData: {
      event_title?: string;
      event_description?: string;
      storage_id?: string;
      album_id?: number;
      event_date?: string | Date;
      event_date_end?: string | Date;
      album_delay?: number;
      event_location?: string;
      private?: boolean;
    },
  ): Promise<any> {
    const existingEvent = await this.prisma.event.findUnique({
      where: { event_id: eventId },
    });

    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
    // Parse dates if they are strings
    const data: any = { ...updateData };

    if (typeof data.event_date === 'string') {
      data.event_date = new Date(data.event_date);
    }

    if (typeof data.event_date_end === 'string') {
      data.event_date_end = new Date(data.event_date_end);
    }

    // Validate dates if both are provided
    if (
      data.event_date &&
      data.event_date_end &&
      data.event_date_end < data.event_date
    ) {
      throw new BadRequestException('End date cannot be before start date');
    }

    const updatedEvent = await this.prisma.event.update({
      where: { event_id: eventId },
      data,
    });

    if (data.event_date || data.event_date_end) {
      // Cancel any existing scheduled notifications
      await this.cancelEventNotifications(eventId);

      // Re-schedule notifications with new dates
      await this.scheduleEventNotifications(eventId);
    }

    return updatedEvent;
  }

  async inviteUserToEvent(userId: number, eventId: number): Promise<any> {
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
