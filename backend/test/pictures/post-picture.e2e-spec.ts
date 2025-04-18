import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';
import { cleanupAfterAll } from '../utils/end-test';
import { PrismaService } from '../../src/prisma.service';
import * as path from 'path';
import * as fs from 'fs';
import { appwriteSave } from '../../appwrite/appwrite.api';

describe('POST /api/pictures', () => {
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

  it("201: returns newly created image object from the database", async () => {
    const testStorageId = 'test-storage-id';

    const {body} = await request(app.getHttpServer())
        .post('/api/pictures')
        .send({storage_id: testStorageId})
        .expect(201)

        //checking returned object
        expect(body).toHaveProperty('picture_id');
        expect(body.storage_id).toBe(testStorageId);
        expect(body.type_id).toBe(1);
        expect(body.album_id).toBeNull();

        //checking database
        const dbEntry = await prisma.picture.findUnique({where: {picture_id: body.picture_id}});
        expect(dbEntry).not.toBeNull();
        expect(dbEntry?.storage_id).toBe(testStorageId);
  })
  it("201: returns a newly created image object from database with provided album_id", async () => {
    const testAlbum = await prisma.album.create({data: {album_name:'Testing album'}});
    const testStorageId = 'test-with-album-storage-id';

    const {body} = await request(app.getHttpServer())
        .post('/api/pictures')
        .send({storage_id: testStorageId, album_id: testAlbum.album_id})
        .expect(201)

        //checking returned object
        expect(body).toHaveProperty('picture_id');
        expect(body.album_id).toBe(testAlbum.album_id);
        expect(body.type_id).toBe(1);

        //checking database
        const dbEntry = await prisma.picture.findUnique({where: {picture_id: body.picture_id}});
        expect(dbEntry).not.toBeNull();
        expect(dbEntry?.album_id).toBe(testAlbum.album_id);
  })
  it("400: Returns 'storage_id must be a string' if storage_id is missing", async() => {
    const {body} = await request(app.getHttpServer())
        .post('/api/pictures')
        .send({})
        .expect(400)

        expect(body.message).toContain('storage_id must be a string');
  })
});