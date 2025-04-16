import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';
import { cleanupAfterAll } from '../utils/end-test';
import { PrismaService } from '../../src/prisma.service';

describe('POST /api/events/:eventId/invite', () => {
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

  afterAll(async () => {
    await cleanupAfterAll(app, prisma);
  }, 15000);

  it('201: creates a UserEvent relation for given user and event', async () => {
    const userId = {
      userId: 12,
    };
    const { body } = await request(app.getHttpServer())
      .post('/api/events/1/invite')
      .send(userId)
      .expect(201);
    expect(body.userEvent_id).toBe(7);
    expect(body.event_id).toBe(1);
    expect(body.user_id).toBe(12);
  });
});
