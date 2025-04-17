// test/utils/setup-test-app.ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app-test.module'; // Use your test module instead of AppModule
import { getMockQueueInstance, getMockNotificationService } from './bull-mocks';
import { seedTestDatabase } from '../../prisma/seed';

export const setupTestApp = async (): Promise<{
  app: INestApplication;
  mockQueue: any;
  mockNotificationService: any;
}> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  await seedTestDatabase();
  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();
  // Get mock instances for use in tests
  const mockQueue = getMockQueueInstance(app);
  const mockNotificationService = getMockNotificationService(app);

  return { app, mockQueue, mockNotificationService };
};

export const teardownTestApp = async (app: INestApplication): Promise<void> => {
  await app.close();

  // Clear any mock data
  jest.clearAllMocks();
};
