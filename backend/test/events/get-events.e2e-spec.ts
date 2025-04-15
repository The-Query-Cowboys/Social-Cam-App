import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';

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

  beforeAll(async () => {
    app = await setupTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

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
