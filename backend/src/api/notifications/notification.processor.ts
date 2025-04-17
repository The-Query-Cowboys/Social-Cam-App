import { Processor, InjectQueue, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { PrismaService } from '../../prisma.service';
import { ExpoNotificationService } from './expo-notification.service';

@Injectable()
@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    @InjectQueue('notifications') private notificationsQueue: Queue,
    private prisma: PrismaService,
    private expoNotificationService: ExpoNotificationService,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
    job.updateProgress(10); // Initial progress

    try {
      let result;
      switch (job.name) {
        case 'eventStart':
          result = await this.handleEventStart(job);
          break;
        case 'photoReminder':
          result = await this.handlePhotoReminder(job);
          break;
        case 'eventEnd':
          result = await this.handleEventEnd(job);
          break;
        default:
          this.logger.warn(`Unknown job type: ${job.name}`);
          return { status: 'unknown_job_type' };
      }
      job.updateProgress(100); // Final progress
      return result;
    } catch (error) {
      this.logger.error(`Error processing job ${job.id}:`, error);
      throw error; // Re-throw to let BullMQ handle the failure
    }
  }

  private async handleEventStart(job: Job) {
    const { eventId, eventTitle } = job.data;
    this.logger.log(
      `Processing event start for "${eventTitle}" (ID: ${eventId})`,
    );
    job.updateProgress(20);

    // Get event details
    const event = await this.prisma.event.findUnique({
      where: { event_id: eventId },
    });

    if (!event) {
      this.logger.error(`Event ${eventId} not found`);
      return { status: 'event_not_found' };
    }

    // Get all users attending this event
    const attendees = await this.prisma.userEvent.findMany({
      where: { event_id: eventId, status_id: 2 }, // Confirmed attendees
      include: {
        user: {
          include: {
            pushTokens: true,
          },
        },
      },
    });

    job.updateProgress(60);

    // Extract user tokens directly from the joined query
    const validPushTokens = attendees
      .flatMap((ue) => ue.user.pushTokens)
      .filter((token) => token && token.token)
      .map((token) => token.token);

    job.updateProgress(70);

    // Send event start notification to all users at once
    if (validPushTokens.length > 0) {
      await this.expoNotificationService.sendNotification(
        validPushTokens,
        `Event Starting: ${eventTitle}`,
        `The event "${eventTitle}" has started!`,
        { eventId, type: 'event_start' },
      );
    }

    job.updateProgress(80);

    // For each attendee, schedule random photo reminders
    for (const attendee of attendees) {
      await this.scheduleRandomPhotoReminders(attendee.user_id, event);
    }

    return {
      status: 'success',
      attendeesNotified: attendees.length,
      tokensNotified: validPushTokens.length,
    };
  }

  private async handlePhotoReminder(job: Job) {
    const { userId, eventId, eventTitle, reminderNumber, totalReminders } =
      job.data;
    this.logger.log(
      `Sending photo reminder ${reminderNumber}/${totalReminders} to user ${userId} for event "${eventTitle}"`,
    );
    job.updateProgress(30);

    // Get user's push tokens
    const userTokens = await this.prisma.userPushToken.findMany({
      where: { user_id: userId },
    });

    const validTokens = userTokens
      .filter((token) => token && token.token)
      .map((token) => token.token);

    job.updateProgress(60);

    if (validTokens.length === 0) {
      this.logger.warn(`No push tokens found for user ${userId}`);
      return { status: 'no_push_token' };
    }

    // Send notification to all user's devices
    await this.expoNotificationService.sendNotification(
      validTokens,
      `Photo Time! (${reminderNumber}/${totalReminders})`,
      `Time to take a photo for "${eventTitle}"!`,
      {
        eventId,
        type: 'photo_reminder',
        reminderNumber,
        deepLink: `camera/${eventId}/${reminderNumber}`,
      },
    );

    return {
      status: 'success',
      tokensNotified: validTokens.length,
    };
  }

  private async handleEventEnd(job: Job) {
    const { eventId, eventTitle } = job.data;
    this.logger.log(
      `Processing event end for "${eventTitle}" (ID: ${eventId})`,
    );
    job.updateProgress(30);

    // Get event details
    const event = await this.prisma.event.findUnique({
      where: { event_id: eventId },
    });

    if (!event) {
      this.logger.error(`Event ${eventId} not found`);
      return { status: 'event_not_found' };
    }

    // Get all attendees with their push tokens
    const attendees = await this.prisma.userEvent.findMany({
      where: { event_id: eventId },
      include: {
        user: {
          include: {
            pushTokens: true,
          },
        },
      },
    });

    job.updateProgress(60);

    // Extract user tokens directly from the joined query
    const validPushTokens = attendees
      .flatMap((ue) => ue.user.pushTokens)
      .filter((token) => token && token.token)
      .map((token) => token.token);

    // Send event end notification to all users at once
    if (validPushTokens.length > 0) {
      await this.expoNotificationService.sendNotification(
        validPushTokens,
        `Event Ended: ${eventTitle}`,
        `The event "${eventTitle}" has ended. Check out all the photos!`,
        {
          eventId,
          type: 'event_end',
          deepLink: `album/${eventId}`,
        },
      );
    }

    return {
      status: 'success',
      attendeesNotified: attendees.length,
      tokensNotified: validPushTokens.length,
    };
  }

  private async scheduleRandomPhotoReminders(
    userId: number,
    event: any,
  ): Promise<void> {
    const startTime = new Date(event.event_date).getTime();
    const endTime = new Date(event.event_date_end).getTime();
    const eventDuration = endTime - startTime;

    // Default to 2 reminders or use a configuration value
    const numberOfReminders = 2;

    // Generate random times distributed throughout the event duration
    const reminderTimes: number[] = [];

    for (let i = 0; i < numberOfReminders; i++) {
      // Calculate a percentage position within the event (reserve 10% buffer at start and end)
      const bufferZone = 0.1 * eventDuration;
      const availableDuration = eventDuration - 2 * bufferZone;

      // Random position within the available duration
      const randomOffset = Math.floor(Math.random() * availableDuration);

      // Actual time = start time + buffer + random offset
      const reminderTime = startTime + bufferZone + randomOffset;
      reminderTimes.push(reminderTime);
    }

    // Sort the times chronologically
    reminderTimes.sort((a, b) => a - b);

    // Schedule each reminder
    for (let i = 0; i < reminderTimes.length; i++) {
      const delay = Math.max(0, reminderTimes[i] - Date.now());

      await this.notificationsQueue.add(
        'photoReminder',
        {
          userId,
          eventId: event.event_id,
          eventTitle: event.event_title,
          reminderNumber: i + 1,
          totalReminders: numberOfReminders,
        },
        {
          delay,
          attempts: 3,
          removeOnComplete: true,
        },
      );

      this.logger.debug(
        `Scheduled photo reminder ${i + 1}/${numberOfReminders} for user ${userId} in ${Math.floor(delay / 1000)}s`,
      );
    }
  }
}
