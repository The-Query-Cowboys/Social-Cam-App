import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectQueue('notifications') private notificationsQueue: Queue,
  ) {}

  /**
   * Schedule event start notification
   * @param eventId The ID of the event
   * @param eventTitle The title of the event
   * @param eventStartTime The timestamp when the event starts
   */
  async scheduleEventStart(
    eventId: string | number,
    eventTitle: string,
    eventStartTime: Date,
  ): Promise<string> {
    const now = new Date();
    const eventTime = new Date(eventStartTime);
    const delay = Math.max(0, eventTime.getTime() - now.getTime());

    this.logger.log(
      `Scheduling event start notification for "${eventTitle}" (ID: ${eventId}) in ${Math.floor(
        delay / 1000 / 60,
      )} minutes`,
    );

    const job = await this.notificationsQueue.add(
      'eventStart',
      {
        eventId,
        eventTitle,
      },
      {
        delay,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: 1000,
      },
    );

    if (!job.id) {
      throw new Error('Failed to create job: no job ID returned');
    }

    return job.id;
  }

  /**
   * Schedule event end notification
   * @param eventId The ID of the event
   * @param eventTitle The title of the event
   * @param eventEndTime The timestamp when the event ends
   */
  async scheduleEventEnd(
    eventId: string | number,
    eventTitle: string,
    eventEndTime: Date,
  ): Promise<string> {
    const now = new Date();
    const endTime = new Date(eventEndTime);
    const delay = Math.max(0, endTime.getTime() - now.getTime());

    this.logger.log(
      `Scheduling event end notification for "${eventTitle}" (ID: ${eventId}) in ${Math.floor(
        delay / 1000 / 60,
      )} minutes`,
    );

    const job = await this.notificationsQueue.add(
      'eventEnd',
      {
        eventId,
        eventTitle,
      },
      {
        delay,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: 1000,
      },
    );

    if (!job.id) {
      throw new Error('Failed to create job: no job ID returned');
    }

    return job.id;
  }

  /**
   * Get job status
   * @param jobId The ID of the job
   */
  async getJobStatus(jobId: string): Promise<any> {
    const job = await this.notificationsQueue.getJob(jobId);
    if (!job) {
      return { status: 'not_found' };
    }

    const state = await job.getState();
    return {
      id: job.id,
      name: job.name,
      data: job.data,
      state,
      progress: job.progress,
      attemptsMade: job.attemptsMade,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
    };
  }

  /**
   * Cancel a scheduled job
   * @param jobId The ID of the job to cancel
   */
  async cancelJob(jobId: string): Promise<boolean> {
    const job = await this.notificationsQueue.getJob(jobId);
    if (!job) {
      return false;
    }

    await job.remove();
    return true;
  }
}
