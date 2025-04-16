// test/utils/bull-mocks.ts
import { Provider } from '@nestjs/common';
import { NotificationProcessor } from '../../src/api/notifications/notification.processor';
import { NotificationService } from '../../src/api/notifications/notifications.service';

export function createBullMockProviders(): Provider[] {
  return [
    // Queue mock
    {
      provide: 'BullQueue_notifications',
      useValue: {
        add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
        getJob: jest.fn().mockResolvedValue({ id: 'mock-job-id', data: {} }),
        getJobs: jest.fn().mockResolvedValue([]),
        removeJobs: jest.fn().mockResolvedValue(undefined),
        close: jest.fn().mockResolvedValue(undefined),
        pause: jest.fn().mockResolvedValue(undefined),
        resume: jest.fn().mockResolvedValue(undefined),
        drain: jest.fn().mockResolvedValue(undefined),
        isPaused: jest.fn().mockResolvedValue(false),
        getJobCounts: jest.fn().mockResolvedValue({
          active: 0,
          completed: 0,
          failed: 0,
          delayed: 0,
          waiting: 0,
        }),
      },
    },

    // Worker mock
    {
      provide: 'BullWorker_notifications',
      useValue: {
        process: jest.fn().mockResolvedValue(undefined),
        on: jest.fn(),
        off: jest.fn(),
        close: jest.fn().mockResolvedValue(undefined),
        pause: jest.fn().mockResolvedValue(undefined),
        resume: jest.fn().mockResolvedValue(undefined),
        isPaused: jest.fn().mockResolvedValue(false),
      },
    },

    // QueueEvents mock
    {
      provide: 'BullQueueEvents_notifications',
      useValue: {
        on: jest.fn(),
        off: jest.fn(),
        close: jest.fn().mockResolvedValue(undefined),
      },
    },

    // Connection provider mock
    {
      provide: 'BullModuleConnectionOptions_default',
      useValue: {
        connection: {
          host: 'mock-host',
          port: 6379,
        },
      },
    },

    // Processor mock
    {
      provide: NotificationProcessor,
      useValue: {
        process: jest.fn().mockImplementation(async (job) => {
          return { status: 'success', mockProcessed: true };
        }),
      },
    },

    // Service mock
    {
      provide: NotificationService,
      useValue: {
        scheduleEventStart: jest.fn().mockResolvedValue('mock-job-id'),
        scheduleEventEnd: jest.fn().mockResolvedValue('mock-job-id'),
        getJobStatus: jest.fn().mockResolvedValue({ status: 'completed' }),
        cancelJob: jest.fn().mockResolvedValue(true),
      },
    },
  ];
}

// If you need access to the mocks for assertions in tests
export function getMockQueueInstance(app) {
  return app.get('BullQueue_notifications');
}

export function getMockNotificationService(app) {
  return app.get(NotificationService);
}
