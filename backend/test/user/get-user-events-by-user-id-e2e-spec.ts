import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';
import { cleanupAfterAll } from '../utils/end-test';
import { PrismaService } from '../../src/prisma.service';

describe('GET /api/users', () => {
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
  
  // it('200: responds with the user denoted by given user_id', async () => {
  //   const { body } = await request(app.getHttpServer())
  //     .get('/api/users/3/events')
  //     .expect(200);
  //   expect(body[1].event_id).toBe(2);
  //   expect(body[1].event_owner_id).toBe(1);
  //   expect(body[1].event_title).toBe('Test event');
  //   expect(body[1].event_description).toBe('Test event');
  //   expect(body[1].storage_id).toBe('67f9380c003d7ff27ca2');
  //   expect(body[1].album_id).toBe(2);
  //   expect(body[1].event_date).toBe('2025-04-15T14:25:14.638Z');
  //   expect(body[1].event_date_end).toBe('2025-04-15T14:25:14.638Z');
  //   expect(body[1].album_delay).toBe(0);
  //   expect(body[1].event_location).toBe('somewhere');
  //   expect(body[1].private).toBe(false);
  // });

  it('404: responds with a user not found error when user does not exist', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/api/users/9999/events')
      .expect(404);
    expect(body.message).toBe('User_id 9999 was not found');
  });
});