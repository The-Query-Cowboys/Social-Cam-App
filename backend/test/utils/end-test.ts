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
  //console.log('Starting test cleanup...');

  // Disconnect Prisma first if provided
  if (prisma) {
    try {
      await prisma.$disconnect();
      //console.log('Disconnected Prisma');
    } catch (error) {
      //console.error('Error disconnecting Prisma:', error);
    }
  }

  // Attempt to close NestJS app with timeout
  try {
    // Create a promise that will resolve after 5 seconds
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 5000));

    // Race between app close and timeout
    await Promise.race([
      app.close().catch((e) => console.error('Error closing app:', e)),
      timeoutPromise.then(() =>
        console.log('App close timed out, continuing with tests'),
      ),
    ]);

    // If app.close() finished first, this will run after successful closure
    // If timeout won first, this will run after the timeout
    //console.log('Cleanup completed');
  } catch (error) {
    console.error('Unexpected error during cleanup:', error);
  }
};
