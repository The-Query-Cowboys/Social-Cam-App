import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';
import { cleanupAfterAll } from '../utils/end-test';
import { PrismaService } from '../../src/prisma.service';
import { Event } from '@prisma/client';
import { seedTestDatabase } from '../../prisma/seed';

describe('DELETE /api/events/:eventId/invite/:userId', () => {
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

  beforeEach(async () => {
    await seedTestDatabase();
  });

  afterAll(async () => {
    await cleanupAfterAll(app, prisma);
  }, 15000);

  it('200: successfully deletes a user event and returns confirmation', async () => {
    const userEventBefore = await prisma.userEvent.findUnique({
      where: { userEvent_id: 5 },
    });
    expect(userEventBefore).not.toBeNull();

    const { body } = await request(app.getHttpServer())
      .delete(`/api/events/1/invite/5`)
      .expect(200);

    // Check response structure
    expect(body.message).toBe('User removed from event successfully');

    // Verify the event no longer exists in the database
    const deletedUserEvent = await prisma.userEvent.findUnique({
      where: { userEvent_id: 5 },
    });
    expect(deletedUserEvent).toBeNull();
  });

  it('404: returns not found when trying to delete a non-existent event', async () => {
    const nonExistentId = 999999; // Assuming this ID doesn't exist

    const { body } = await request(app.getHttpServer())
      .delete(`/api/events/${nonExistentId}/invite/1`)
      .expect(404);

    expect(body).toHaveProperty('message');
    expect(body.message).toBe(
      `User Event with user ID ${1} and event ID ${nonExistentId} was not found`,
    );
  });

  it('400: returns bad request when event ID is invalid', async () => {
    await request(app.getHttpServer())
      .delete('/api/events/invalid-id/invite/1')
      .expect(400);
  });
});
