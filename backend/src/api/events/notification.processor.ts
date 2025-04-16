import { Processor, InjectQueue, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { PrismaService } from '../../prisma.service';
import { ExpoNotificationService } from '../notifications/expo-notification.service';

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

    try {
      switch (job.name) {
        case 'eventStart':
          return await this.handleEventStart(job);
        case 'photoReminder':
          return await this.handlePhotoReminder(job);
        case 'eventEnd':
          return await this.handleEventEnd(job);
        default:
          this.logger.warn(`Unknown job type: ${job.name}`);
          return { status: 'unknown_job_type' };
      }
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
      where: { event_id: eventId, status_id: 2 },
    });

    this.logger.log(
      `Found ${attendees.length} attendees for event "${eventTitle}"`,
    );

    // Get all user IDs to fetch their push tokens
    const userIds = attendees.map((attendee) => attendee.user_id);

    // Get push tokens for all users
    const userPushTokens = await this.prisma.userPushToken.findMany({
      where: {
        user_id: { in: userIds },
      },
    });

    const userTokenMap = new Map();
    userPushTokens.forEach((tokenEntry) => {
      if (!userTokenMap.has(tokenEntry.user_id)) {
        userTokenMap.set(tokenEntry.user_id, []);
      }
      userTokenMap.get(tokenEntry.user_id).push(tokenEntry.token);
    });

    const validPushTokens = userPushTokens
      .map((userPushTokens) => userPushTokens.token)
      .filter((token): token is string => !!token && token.length > 0);

    // Send event start notification to all users at once
    if (validPushTokens.length > 0) {
      await this.expoNotificationService.sendNotification(
        validPushTokens,
        `Event Starting: ${eventTitle}`,
        `The event "${eventTitle}" has started!`,
        { eventId, type: 'event_start' },
      );
    }

    // For each attendee, schedule random photo reminders
    for (const attendee of attendees) {
      await this.scheduleRandomPhotoReminders(attendee.user_id, event);
    }

    return { status: 'success', attendeesNotified: attendees.length };
  }

  //send reminder to user, enable use of the camera
  private async handlePhotoReminder(job: Job) {
    const { userId, eventId, eventTitle, reminderNumber, totalReminders } =
      job.data;
    this.logger.log(
      `Sending photo reminder ${reminderNumber}/${totalReminders} to user ${userId} for event "${eventTitle}"`,
    );

    // Get user's push token
    const userToken = await this.prisma.userPushToken.findFirst({
      where: { user_id: userId },
    });

    if (!userToken?.token) {
      this.logger.warn(`No push token found for user ${userId}`);
      return { status: 'no_push_token' };
    }

    // Send notification
    await this.expoNotificationService.sendNotification(
      [userToken.token],
      `Photo Time! (${reminderNumber}/${totalReminders})`,
      `Time to take a photo for "${eventTitle}"!`,
      {
        eventId,
        type: 'photo_reminder',
        reminderNumber,
        //will need to update the deeplink when the camers is implemented
        deepLink: `camera/${eventId}/${reminderNumber}`,
      },
    );

    return { status: 'success' };
  }

  private async handleEventEnd(job: Job) {
    const { eventId, eventTitle } = job.data;
    this.logger.log(
      `Processing event end for "${eventTitle}" (ID: ${eventId})`,
    );

    // Get all attendees
    const attendees = await this.prisma.userEvent.findMany({
      where: { event_id: eventId },
    });

    const userIds = attendees.map((attendee) => attendee.user_id);

    // Get push tokens for all users
    const userPushTokens = await this.prisma.userPushToken.findMany({
      where: {
        user_id: {
          in: userIds,
        },
      },
    });

    // Collect all valid push tokens
    const validPushTokens = userPushTokens
      .map((user) => user.token)
      .filter((token): token is string => !!token && token.length > 0);

    // Send event end notification to all users at once
    if (validPushTokens.length > 0) {
      await this.expoNotificationService.sendNotification(
        validPushTokens,
        `Event Ended: ${eventTitle}`,
        `The event "${eventTitle}" has ended.`,
        { eventId, type: 'event_end' },
      );
    }

    return { status: 'success', attendeesNotified: attendees.length };
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
