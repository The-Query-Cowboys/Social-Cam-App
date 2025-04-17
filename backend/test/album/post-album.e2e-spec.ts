import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';
import { cleanupAfterAll } from '../utils/end-test';
import { PrismaService } from '../../src/prisma.service';

describe('POST /api/albums', () => {
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

  it('201 responds with newly created album object', async () => {
    const testAlbum = {album_name: "Post album test"};
    const {body} = await request(app.getHttpServer())
        .post("/api/albums")
        .send(testAlbum)
        .expect(201)
        expect(typeof body.album_id).toBe("number");
        expect(body.album_name).toEqual(testAlbum.album_name);
  });
  it('400 responds with bad request if album_name is missing from request', async () => {
    const testAlbum = {};
    const {body} = await request(app.getHttpServer())
        .post("/api/albums")
        .send(testAlbum)
        .expect(400)
        expect(body.message).toContain("album_name must be a string");
  });
});