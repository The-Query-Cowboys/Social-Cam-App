import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';
import { cleanupAfterAll } from '../utils/end-test';
import { PrismaService } from '../../src/prisma.service';

describe('GET /api/albums/:event_id', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await setupTestApp();
    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await cleanupAfterAll(app, prisma);
  }, 15000);

  it('200: responds with album id and album name for passed in event_id', async () => {
    const expected = {
      album_id: 2,
      album_name: 'test album',
    };
    const { body } = await request(app.getHttpServer())
      .get('/api/albums/2')
      .expect(200);
    expect(body).toEqual(expected);
  });
  it("404: responds with event not found error when event does not exist", async () => {
    const {body} = await request(app.getHttpServer())
      .get('/api/albums/99999999')
      .expect(404)
      expect(body.message).toBe("Event with ID 99999999 not found");
});
  it("400: responds with 'Validation failed' when event_id is not a number", async () => {
    const {body} = await request(app.getHttpServer())
      .get('/api/albums/not-a-valid-id')
      .expect(400)
      expect(body.message).toContain('Validation failed');
  });
});
