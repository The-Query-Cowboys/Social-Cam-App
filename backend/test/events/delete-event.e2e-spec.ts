import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';
import { cleanupAfterAll } from '../utils/end-test';
import { PrismaService } from '../../src/prisma.service';
import { Event } from '@prisma/client';
import { seedTestDatabase } from '../../prisma/seed';

describe('DELETE /api/events/:eventId', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mockQueue: any;
  let mockNotificationService: any;
  let testEvent: Event;
  let testUserId: number;

  beforeAll(async () => {
    const setup = await setupTestApp();
    app = setup.app;
    mockQueue = setup.mockQueue;
    mockNotificationService = setup.mockNotificationService;
    prisma = app.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await seedTestDatabase();
  });

  afterAll(async () => {
    await cleanupAfterAll(app, prisma);
  }, 15000);

  it('200: successfully deletes an event and returns confirmation', async () => {
    const eventBefore = await prisma.event.findUnique({
      where: { event_id: 2 },
    });
    expect(eventBefore).not.toBeNull();

    const { body } = await request(app.getHttpServer())
      .delete(`/api/events/2`)
      .expect(200);

    // Check response structure
    expect(body.message).toBe('Event deleted successfully');
    expect(body.event_id).toBe(2);

    // Verify the event no longer exists in the database
    const deletedEvent = await prisma.event.findUnique({
      where: { event_id: 2 },
    });
    expect(deletedEvent).toBeNull();

    // Verify that related UserEvent records were deleted
    const userEvents = await prisma.userEvent.findMany({
      where: { event_id: 2 },
    });
    expect(userEvents.length).toBe(0);

    // Verify that related comments were deleted
    const comments = await prisma.comment.findMany({
      where: { event_id: 2 },
    });
    expect(comments.length).toBe(0);
  });

  it('404: returns not found when trying to delete a non-existent event', async () => {
    const nonExistentId = 999999; // Assuming this ID doesn't exist

    const { body } = await request(app.getHttpServer())
      .delete(`/api/events/${nonExistentId}`)
      .expect(404);

    expect(body).toHaveProperty('message');
    expect(body.message).toBe(`Event with ID ${nonExistentId} not found`);
  });

  it('400: returns bad request when event ID is invalid', async () => {
    await request(app.getHttpServer())
      .delete('/api/events/invalid-id')
      .expect(400);
  });
});
