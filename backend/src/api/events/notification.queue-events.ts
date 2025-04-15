import {
  QueueEventsListener,
  QueueEventsHost,
  OnQueueEvent,
} from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@QueueEventsListener('notifications')
export class NotificationQueueEvents {
  private readonly logger = new Logger(NotificationQueueEvents.name);

  @OnQueueEvent('completed')
  onCompleted(job: { jobId: string; returnvalue: any }) {
    this.logger.log(
      `Job ${job.jobId} completed with result: ${JSON.stringify(job.returnvalue)}`,
    );
  }

  @OnQueueEvent('failed')
  onFailed(job: { jobId: string; failedReason: string }) {
    this.logger.error(
      `Job ${job.jobId} failed with reason: ${job.failedReason}`,
    );
  }

  @OnQueueEvent('active')
  onActive(job: { jobId: string; prev?: string }) {
    this.logger.log(`Job ${job.jobId} is now active`);
  }

  @OnQueueEvent('progress')
  onProgress(job: { jobId: string; data: number | object }) {
    this.logger.log(
      `Job ${job.jobId} reported progress: ${JSON.stringify(job.data)}`,
    );
  }
}
