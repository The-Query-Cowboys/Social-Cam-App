import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';
import { cleanupAfterAll } from '../utils/end-test';
import { PrismaService } from '../../src/prisma.service';

describe('GET /api/pictures/album/:album_id', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await setupTestApp();
    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await cleanupAfterAll(app, prisma);
  }, 15000);

  it("200: returns array of picture objects for given album", async () => {
    const {body} = await request(app.getHttpServer())
        .get("/api/pictures/album/1")
        .expect(200)
        expect(Array.isArray(body.pictures)).toBe(true);

        body.pictures.forEach(picture => {
            expect(picture.album_id).toBe(1);
            expect(typeof picture.picture_id).toBe("number");
            expect(typeof picture.storage_id).toBe("string");
            expect(typeof picture.type_id).toBe("number");
        })
  })
  it("404: returns album not found when passed in valid album_id that doesn't exist", async () => {
    const {body} = await request(app.getHttpServer())
        .get("/api/pictures/album/99999")
        .expect(404)
        expect(body.message).toContain("Album not found")
  })
  it("400: returns 'Validation failed' when album_id is not a valid number", async () => {
    const {body} = await request(app.getHttpServer())
        .get("/api/pictures/album/not-a-valid-id")
        .expect(400)
        expect(body.message).toContain("Validation failed");
  })
});