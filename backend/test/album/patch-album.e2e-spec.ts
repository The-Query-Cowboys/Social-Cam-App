import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';
import { cleanupAfterAll } from '../utils/end-test';
import { PrismaService } from '../../src/prisma.service';

describe('PATCH /api/albums/:album_id', () => {
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

  it ("200 responds with object containing message 'Pictures removed from album' and count of removed pictures when ?action=remove", async () => {
    const testPictures = {pictures:[{"picture_id": 1}]};
    const {body} = await request(app.getHttpServer())
        .patch("/api/albums/1?action=remove")
        .send(testPictures)
        .expect(200)
        expect(body.message).toBe("Pictures removed from album");
        expect(body.count).toBe(1);
  })
  it("200 responds with object containing message 'Pictures added to album' and count of added pictures when ?action=add" , async () => {
    const testPictures = {pictures:[{"picture_id": 1}]};
    const {body} = await request(app.getHttpServer())
        .patch("/api/albums/1?action=add")
        .send(testPictures)
        .expect(200)
        expect(body.message).toBe("Pictures added to album");
        expect(body.count).toBe(1);
  })
  it("400 responds with 'pictures must be an array' if pictures array is missing from array object", async () => {
    const testPictures = {};
    const {body} = await request(app.getHttpServer())
      .patch("/api/albums/1?action=add")
      .send(testPictures)
      .expect(400)
      expect(body.message).toContain("pictures must be an array");
  })
});