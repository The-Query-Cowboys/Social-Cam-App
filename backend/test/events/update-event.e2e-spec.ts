import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../../src/prisma.service';
import { Event } from '@prisma/client';
import { setupTestApp } from '../utils/setup-test';
import { cleanupAfterAll } from '../utils/end-test';

describe('Events Controller (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testEvent: Event;
  let testUserId: number;

  beforeAll(async () => {
    app = await setupTestApp();
    prisma = app.get<PrismaService>(PrismaService);

    // Clean up any existing test data
    await prisma.event.deleteMany({
      where: {
        event_title: { startsWith: 'Lumon' },
      },
    });

    // Create a test user for the events
    const testUser = await prisma.user.create({
      data: {
        username: 'MarkScout',
        nickname: 'Mark S.',
        description: 'Severed employee at Lumon Industries',
        auth_id: 'auth_lumon_test',
        storage_id: 'storage_lumon_test',
        email: 'mark.s@lumon.com',
      },
    });
    testUserId = testUser.user_id;

    // Create a test album
    const testAlbum = await prisma.album.create({
      data: {
        album_name: 'Lumon Dance Experience',
      },
    });

    // Create a UserStatus for testing
    await prisma.userStatus.createMany({
      data: [
        { status: 'attending' },
        { status: 'declined' },
        { status: 'pending' },
      ],
      skipDuplicates: true,
    });
  });

  beforeEach(async () => {
    // Create a test album before creating the event
    const album = await prisma.album.findFirst({
      where: { album_name: 'Lumon Dance Experience' },
    });

    if (!album) {
      throw new Error('Test album not found');
    }

    // Create a test event before each test - Music Dance Experience at Lumon
    testEvent = await prisma.event.create({
      data: {
        event_owner_id: testUserId,
        event_title: 'Lumon Music Dance Experience',
        event_description:
          'A special event for severed employees to enjoy music and movement as a reward for reaching departmental quotas.',
        event_date: new Date('2025-05-01T15:00:00Z'),
        event_date_end: new Date('2025-05-01T16:30:00Z'),
        event_location: 'Lumon Break Room',
        album_id: album.album_id,
        storage_id: 'storage_dance_experience_test',
        album_delay: 30,
        private: true,
      },
    });
  });

  afterEach(async () => {
    // Clean up the test event after each test
    if (testEvent && testEvent.event_id) {
      await prisma.event
        .delete({
          where: { event_id: testEvent.event_id },
        })
        .catch(() => {
          // Ignore errors if event was already deleted in the test
        });
    }
  });

  afterAll(async () => {
    // Final cleanup
    await prisma.event.deleteMany({
      where: {
        event_title: { startsWith: 'Lumon' },
      },
    });

    // Clean up test user
    await prisma.user
      .delete({
        where: { user_id: testUserId },
      })
      .catch(() => {
        console.log('User already deleted or not found');
      });

    // Use the utility function for proper cleanup
    await cleanupAfterAll(app, prisma);
  });

  describe('PATCH /api/events/:eventId', () => {
    it('should update the Music Dance Experience with valid data', async () => {
      const updateData = {
        event_title: 'Lumon Quarterly Music Dance Experience',
        event_description:
          'Special extended dance experience featuring refreshments and the defiant jazz selection.',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/events/${testEvent.event_id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.event_title).toBe(updateData.event_title);
      expect(response.body.event_description).toBe(
        updateData.event_description,
      );
      expect(response.body.event_id).toBe(testEvent.event_id);

      // Verify database was updated
      const updatedEvent = await prisma.event.findUnique({
        where: { event_id: testEvent.event_id },
      });

      expect(updatedEvent).not.toBeNull();
      if (updatedEvent) {
        expect(updatedEvent.event_title).toBe(updateData.event_title);
        expect(updatedEvent.event_description).toBe(
          updateData.event_description,
        );
      }
    });

    it('should return 404 when event does not exist', async () => {
      const nonExistentId = 999999; // Assuming this ID doesn't exist

      await request(app.getHttpServer())
        .patch(`/api/events/${nonExistentId}`)
        .send({ event_title: 'Canceled Dance Experience' })
        .expect(404);
    });

    it('should return 400 when end date is before start date', async () => {
      const updateData = {
        event_date: new Date('2025-05-01T17:00:00Z'),
        event_date_end: new Date('2025-05-01T16:00:00Z'), // Before start date
      };

      await request(app.getHttpServer())
        .patch(`/api/events/${testEvent.event_id}`)
        .send(updateData)
        .expect(400);

      // Verify database was not updated
      const unchangedEvent = await prisma.event.findUnique({
        where: { event_id: testEvent.event_id },
      });

      expect(unchangedEvent).not.toBeNull();
      if (unchangedEvent) {
        expect(new Date(unchangedEvent.event_date).toISOString()).toBe(
          new Date(testEvent.event_date).toISOString(),
        );
      }
    });

    it('should return 400 when updating only end date to be before existing start date', async () => {
      const updateData = {
        event_date_end: new Date('2025-05-01T14:30:00Z'), // Before existing start date
      };

      await request(app.getHttpServer())
        .patch(`/api/events/${testEvent.event_id}`)
        .send(updateData)
        .expect(400);
    });

    it('should successfully update the event to move to the Perpetuity Wing', async () => {
      const updateData = {
        event_location: 'Lumon Perpetuity Wing',
        event_description:
          "Special dance experience with Kier's favorite music in celebration of the founder.",
        album_delay: 45,
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/events/${testEvent.event_id}`)
        .send(updateData)
        .expect(200);

      // Verify fields were updated in response
      expect(response.body.event_location).toBe(updateData.event_location);
      expect(response.body.event_description).toBe(
        updateData.event_description,
      );
      expect(response.body.album_delay).toBe(updateData.album_delay);

      // Verify database was updated
      const updatedEvent = await prisma.event.findUnique({
        where: { event_id: testEvent.event_id },
      });

      expect(updatedEvent).not.toBeNull();
      if (updatedEvent) {
        expect(updatedEvent.event_location).toBe(updateData.event_location);
        expect(updatedEvent.event_description).toBe(
          updateData.event_description,
        );
        expect(updatedEvent.album_delay).toBe(updateData.album_delay);
      }
    });

    it('should successfully extend the Music Dance Experience duration', async () => {
      const updateData = {
        event_date: new Date('2025-05-01T14:30:00Z'), // Earlier start
        event_date_end: new Date('2025-05-01T17:00:00Z'), // Later end
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/events/${testEvent.event_id}`)
        .send(updateData)
        .expect(200);

      // Check response has updated dates
      expect(new Date(response.body.event_date).toISOString()).toBe(
        new Date(updateData.event_date).toISOString(),
      );
      expect(new Date(response.body.event_date_end).toISOString()).toBe(
        new Date(updateData.event_date_end).toISOString(),
      );

      // Verify database was updated
      const updatedEvent = await prisma.event.findUnique({
        where: { event_id: testEvent.event_id },
      });

      expect(updatedEvent).not.toBeNull();
      if (updatedEvent) {
        expect(new Date(updatedEvent.event_date).toISOString()).toBe(
          new Date(updateData.event_date).toISOString(),
        );
        expect(new Date(updatedEvent.event_date_end).toISOString()).toBe(
          new Date(updateData.event_date_end).toISOString(),
        );
      }
    });

    it('should reject negative album_delay', async () => {
      const invalidData = {
        event_title: 'Waffle Party Experience',
        album_delay: -10, // Negative value
      };

      await request(app.getHttpServer())
        .patch(`/api/events/${testEvent.event_id}`)
        .send(invalidData)
        .expect(400);
    });

    it('should update multiple fields', async () => {
      const updateData = {
        event_title: 'Lumon Quarterly Camaraderie Session',
        event_description:
          'Team building exercises and melon bar, followed by music dance experience.',
        event_location: 'Lumon Wellness Center',
        album_delay: 60,
        private: true,
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/events/${testEvent.event_id}`)
        .send(updateData)
        .expect(200);

      // Verify all fields were updated in response
      expect(response.body.event_title).toBe(updateData.event_title);
      expect(response.body.event_description).toBe(
        updateData.event_description,
      );
      expect(response.body.event_location).toBe(updateData.event_location);
      expect(response.body.album_delay).toBe(updateData.album_delay);
      expect(response.body.private).toBe(updateData.private);

      // Verify database was updated
      const updatedEvent = await prisma.event.findUnique({
        where: { event_id: testEvent.event_id },
      });

      expect(updatedEvent).not.toBeNull();
      if (updatedEvent) {
        expect(updatedEvent.event_title).toBe(updateData.event_title);
        expect(updatedEvent.event_description).toBe(
          updateData.event_description,
        );
        expect(updatedEvent.event_location).toBe(updateData.event_location);
        expect(updatedEvent.album_delay).toBe(updateData.album_delay);
        expect(updatedEvent.private).toBe(updateData.private);
      }
    });
  });
});
