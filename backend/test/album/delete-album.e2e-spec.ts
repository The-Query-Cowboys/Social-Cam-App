import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';
import { cleanupAfterAll } from '../utils/end-test';
import { PrismaService } from '../../src/prisma.service';

describe('DELETE /api/albums/:album_id', () => {
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

  it("204: deletes album and unlinks pictures", async () => {
    const albumBefore = await prisma.album.findUnique({
        where: {album_id: 2},
    });
    expect(albumBefore).toBeTruthy();

    const linkedPicturesBefore = await prisma.picture.findMany({where: {album_id: 2}});
    expect(linkedPicturesBefore.length).toBeGreaterThan(0);

    await request(app.getHttpServer())
        .delete("/api/albums/2")
        .expect(204)
    
    const albumAfter = await prisma.album.findUnique({where: {album_id: 2}});
    expect(albumAfter).toBeNull();

    const linkedPicturesAfter = await prisma.picture.findMany({where: {album_id: 2}});
    expect(linkedPicturesAfter.length).toBe(0);
  })
});