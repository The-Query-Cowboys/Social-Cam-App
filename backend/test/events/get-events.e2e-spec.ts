import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';
import { cleanupAfterAll } from '../utils/end-test';
import { PrismaService } from '../../src/prisma.service';

// model Event {
//   event_id          Int         @id @default(autoincrement())
//   event_owner_id    Int
//   event_title       String
//   event_description String
//   storage_id        String
//   album_id          Int
//   event_date        DateTime    @default(now())
//   event_date_end    DateTime    @default(now())
//   album_delay       Int         @default(0)
//   event_location    String
//   private           Boolean
//   UserEvent         UserEvent[]
//   Comment           Comment[]
// }

describe('GET /api/events', () => {
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

  it('200: responds with an array of events', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/api/events')
      .expect(200);
    body.forEach((event) => {
      expect(typeof event.event_id).toBe('number');
      expect(typeof event.event_owner_id).toBe('number');
      expect(typeof event.event_title).toBe('string');
      expect(typeof event.event_description).toBe('string');
      expect(typeof event.album_id).toBe('number');
      expect(typeof event.storage_id).toBe('string');
      expect(typeof event.event_location).toBe('string');
      expect(typeof event.album_delay).toBe('number');
      expect(typeof event.private).toBe('boolean');
      expect(typeof event.event_date_end).toBe('string');
      expect(typeof event.event_date).toBe('string');
    });
  });
});
