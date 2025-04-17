import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';
import { cleanupAfterAll } from '../utils/end-test';
import { PrismaService } from '../../src/prisma.service';

describe('GET /api/pictures/:picture_id', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await setupTestApp();
    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await cleanupAfterAll(app, prisma);
  }, 15000);

  it("200: returns an individual picture object", async () => {
    const {body} = await request(app.getHttpServer())
        .get('/api/pictures/1')
        .expect(200)
        expect(body.picture_id).toBe(1);
        expect(body.album_id).toBe(1);
        expect(body.storage_id).toBe("67f9386500316bb3c9e7");
        expect(body.type_id).toBe(3);
  })
  it("404: returns picture not found when a valid id is passed that doesn't exist", async () => {
    const {body} = await request(app.getHttpServer())
      .get('/api/pictures/999999')
      .expect(404)
      expect(body.message).toContain("picture not found");
  })
  it("400: returns 'Validation failed' if non-valid id is passed in", async () => {
    const {body} = await request(app.getHttpServer())
      .get('/api/pictures/not-a-valid-id')
      .expect(400)
      expect(body.message).toContain("Validation failed (numeric string is expected)");
  })
});