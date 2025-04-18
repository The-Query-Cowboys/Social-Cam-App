import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';
import { cleanupAfterAll } from '../utils/end-test';
import { PrismaService } from '../../src/prisma.service';
import * as path from 'path';
import * as fs from 'fs';
import { appwriteSave } from '../../appwrite/appwrite.api';

describe('DELETE /api/pictures/:picture_id', () => {
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

  it("204: deletes picture on db and appwrite", async () => {
    //test image located in backend/test/pictures/deleteTest.jpeg
    const imagePath = path.join(__dirname, 'deleteTest.jpeg');
    const buffer = fs.readFileSync(imagePath);

    const storageId = await appwriteSave({buffer});
    expect(typeof storageId).toBe('string');

    const picture = await prisma.picture.create({data: {storage_id: storageId, album_id: null, type_id: 3}});
    const beforeDeletion = await prisma.picture.findUnique({where: {picture_id: picture.picture_id}});
    expect(beforeDeletion).not.toBeNull();

    await request(app.getHttpServer())
        .delete(`/api/pictures/${picture.picture_id}`)
        .expect(204);
    
    const deleted = await prisma.picture.findUnique({where: {picture_id: picture.picture_id}});
    expect(deleted).toBeNull();
  })
});