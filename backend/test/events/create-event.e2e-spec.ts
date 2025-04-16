import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';
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

describe('POST /api/events', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await setupTestApp();

    prisma = app.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // await prisma.comment.deleteMany({});
    // await prisma.event.deleteMany({});
  });
  afterAll(async () => {
    await app.close();
  });

  it('201: successfully creates an event with valid data', async () => {
    const newEvent = {
      event_owner_id: 11,
      event_title: 'Music Dance Experience',
      event_description:
        'Quarterly mandatory wellness session for all Lumon employees',
      album_id: 1,
      storage_id: 'lumon-mde-123',
      event_location: 'Lumon Industries Conference Room',
      album_delay: 60,
      private: true,
      event_date: new Date(Date.now()).toISOString(),
      event_date_end: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
    };

    const { body } = await request(app.getHttpServer())
      .post('/api/events')
      .send(newEvent)
      .expect(201);

    expect(body).toHaveProperty('event_id');
    expect(typeof body.event_id).toBe('number');
    expect(body.event_owner_id).toBe(newEvent.event_owner_id);
    expect(body.event_title).toBe(newEvent.event_title);
    expect(body.event_description).toBe(newEvent.event_description);
    expect(body.album_id).toBe(newEvent.album_id);
    expect(body.storage_id).toBe(newEvent.storage_id);
    expect(body.event_location).toBe(newEvent.event_location);
    expect(body.album_delay).toBe(newEvent.album_delay);
    expect(body.private).toBe(newEvent.private);
    expect(new Date(body.event_date).toISOString()).toBe(newEvent.event_date);
    expect(new Date(body.event_date_end).toISOString()).toBe(
      newEvent.event_date_end,
    );
  });

  it('400: fails when required fields are missing', async () => {
    const incompleteEvent = {
      event_owner_id: 1,
    };

    const { body } = await request(app.getHttpServer())
      .post('/api/events')
      .send(incompleteEvent)
      .expect(400);

    expect(body).toHaveProperty('message');
    expect(Array.isArray(body.message)).toBe(true);
    // Check that the error message contains information about missing fields
    expect(body.message.some((msg: string) => msg.includes('title'))).toBe(
      true,
    );
  });

  it('400: fails when field types are incorrect', async () => {
    const invalidTypeEvent = {
      event_owner_id: 'not-a-number', // Should be a number
      title: 'Defiant Jazz',
      event_description: 'Alternative wellness session with Ms. Casey',
      album_id: 1,
      storage_id: 'lumon-defiantjazz-789',
      location: 'Lumon Industries Wellness Center',
      album_delay: 'sixty', // Should be a number
      private: 'not-a-boolean', // Should be a boolean
      event_date: new Date().toISOString(),
      event_date_end: new Date(Date.now() + 3600000).toISOString(),
    };

    const { body } = await request(app.getHttpServer())
      .post('/api/events')
      .send(invalidTypeEvent)
      .expect(400);

    expect(body).toHaveProperty('message');
  });

  it('400: fails when date format is invalid', async () => {
    const invalidDateEvent = {
      event_owner_id: 1,
      title: 'Birthday Party',
      event_description: 'Celebrating my 30th birthday',
      album_id: 1,
      storage_id: 'storage123',
      location: 'Central Park',
      album_delay: 60,
      private: false,
      event_date: 'not-a-date', // Invalid date format
      event_date_end: 'also-not-a-date', // Invalid date format
    };

    const { body } = await request(app.getHttpServer())
      .post('/api/events')
      .send(invalidDateEvent)
      .expect(400);

    expect(body).toHaveProperty('message');
  });

  it('400: fails when end date is before start date', async () => {
    const invalidDateRangeEvent = {
      event_owner_id: 1,
      event_title: 'Birthday Party',
      event_description: 'Celebrating my 30th birthday',
      album_id: 1,
      storage_id: 'storage123',
      event_location: 'Central Park',
      album_delay: 60,
      private: false,
      event_date: new Date(Date.now() + 3600000).toISOString(), // 1 hour in the future
      event_date_end: new Date().toISOString(), // Now (before start date)
    };

    const { body } = await request(app.getHttpServer())
      .post('/api/events')
      .send(invalidDateRangeEvent)
      .expect(400);

    expect(body).toHaveProperty('message');
  });

  it('400: fails when album_delay is negative', async () => {
    const negativeDelayEvent = {
      event_owner_id: 1,
      event_title: 'Birthday Party',
      event_description: 'Celebrating my 30th birthday',
      album_id: 1,
      storage_id: 'storage123',
      event_location: 'Central Park',
      album_delay: -10, // Negative delay
      private: false,
      event_date: new Date().toISOString(),
      event_date_end: new Date(Date.now() + 3600000).toISOString(),
    };

    const { body } = await request(app.getHttpServer())
      .post('/api/events')
      .send(negativeDelayEvent)
      .expect(400);

    expect(body).toHaveProperty('message');
  });

  it.skip('403: fails when user does not have permission to create event', async () => {
    const unauthorizedEvent = {
      event_owner_id: 999, // Assuming this user doesn't exist or doesn't have permissions
      event_title: 'Birthday Party',
      event_description: 'Celebrating my 30th birthday',
      album_id: 1,
      storage_id: 'storage123',
      event_location: 'Central Park',
      album_delay: 60,
      private: false,
      event_date: new Date().toISOString(),
      event_date_end: new Date(Date.now() + 3600000).toISOString(),
    };
    await request(app.getHttpServer())
      .post('/api/events')
      .send(unauthorizedEvent)
      .expect(403);
  });

  it('201: creates an event with default values when optional fields are omitted', async () => {
    const eventWithDefaults = {
      event_owner_id: 1,
      event_title: 'Waffle Party',
      event_description: 'Special reward for exemplary macrodata refinement',
      album_id: 1,
      storage_id: 'lumon-waffleparty-456',
      event_location: 'Lumon Industries Perpetuity Wing',
      private: true,
      // Omitting album_delay, event_date, and event_date_end to test defaults
    };

    const { body } = await request(app.getHttpServer())
      .post('/api/events')
      .send(eventWithDefaults)
      .expect(201);

    expect(body).toHaveProperty('event_id');
    expect(body.album_delay).toBe(0); // Default value
    expect(body).toHaveProperty('event_date');
    expect(body).toHaveProperty('event_date_end');
  });
});
