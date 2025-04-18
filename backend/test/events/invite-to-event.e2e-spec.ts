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
      userId: 3,
    };
    const { body } = await request(app.getHttpServer())
      .post('/api/events/1/invite')
      .send(userId)
      .expect(201);
    expect(body.userEvent_id).toBe(7);
    expect(body.event_id).toBe(1);
    expect(body.user_id).toBe(3);
  });
  it('400: fails when userId is missing', async () => {
    const { body } = await request(app.getHttpServer())
      .post(`/api/events/1/invite`)
      .send({})
      .expect(400);

    expect(body.message[0]).toBe('userId should not be empty');
  });
  it('404: fails when user does not exist', async () => {
    const nonExistentUserId = 99999;
    const payload = {
      userId: nonExistentUserId,
    };

    const { body } = await request(app.getHttpServer())
      .post(`/api/events/1/invite`)
      .send(payload)
      .expect(404);

    expect(body.message).toBe(`User with ID ${nonExistentUserId} not found`);
  });
  it('404: fails when event does not exist', async () => {
    const nonExistentEventId = 99999;
    const payload = {
      userId: 1,
    };

    const { body } = await request(app.getHttpServer())
      .post(`/api/events/${nonExistentEventId}/invite`)
      .send(payload)
      .expect(404);

    expect(body.message).toBe(`Event with ID ${nonExistentEventId} not found`);
  });
});
