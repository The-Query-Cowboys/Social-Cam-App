import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';
import { cleanupAfterAll } from '../utils/end-test';
import { PrismaService } from '../../src/prisma.service';

describe('POST /api/events', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mockQueue: any;
  let mockNotificationService: any;

  beforeAll(async () => {
    const setup = await setupTestApp();
    app = setup.app;
    mockQueue = setup.mockQueue;
    mockNotificationService = setup.mockNotificationService;
    prisma = app.get<PrismaService>(PrismaService);
  });
  it('200: responds with a token generated by given user_id', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/api/token/1')
      .expect(200);
    expect(body.token.length).toBeGreaterThan(0);
  });

  it('404: responds with a user not found error when user does not exist', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/api/token/9999')
      .expect(404);
    expect(body.message).toBe('User_id 9999 was not found');
  });
});
