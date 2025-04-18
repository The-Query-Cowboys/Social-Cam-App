// utils/end-test.ts
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma.service';

/**
 * Jest-safe cleanup function that ensures tests complete
 * without using process.exit which breaks Jest workers
 */
export const cleanupAfterAll = async (
  app: INestApplication,
  prisma?: PrismaService,
): Promise<void> => {
  // Clear mocks first
  jest.clearAllMocks();

  // Try to close any BullMQ resources if they exist
  try {
    // Try to get and close any queue instances
    const mockQueue = app.get('BullQueue_notifications', { strict: false });
    if (mockQueue && typeof mockQueue.close === 'function') {
      await mockQueue.close();
    }

    // Try to get and close any worker instances
    const mockWorker = app.get('BullWorker_notifications', { strict: false });
    if (mockWorker && typeof mockWorker.close === 'function') {
      await mockWorker.close();
    }

    // Try to get and close any queue events instances
    const mockQueueEvents = app.get('BullQueueEvents_notifications', {
      strict: false,
    });
    if (mockQueueEvents && typeof mockQueueEvents.close === 'function') {
      await mockQueueEvents.close();
    }
  } catch (error) {
    // Ignore errors from trying to get mock providers
  }

  // Disconnect Prisma first if provided
  if (prisma) {
    try {
      await prisma.$disconnect();
    } catch (error) {
      // Error handling
    }
  }
  try {
    // Create a promise that will resolve after 5 seconds
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 5000));

    // Race between app close and timeout
    await Promise.race([
      app.close().catch((e) => console.error('Error closing app:', e)),
      timeoutPromise,
    ]);
  } catch (error) {
    console.error('Unexpected error during cleanup:', error);
  }
};
