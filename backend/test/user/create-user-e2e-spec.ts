import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';
import { cleanupAfterAll } from '../utils/end-test';
import { PrismaService } from '../../src/prisma.service';

// model User {
//   user_id     Int             @id @default(autoincrement())
//   username    String
//   nickname    String
//   description String
//   auth_id     String
//   storage_id  String
//   email       String
//   UserEvent   UserEvent[]
//   pushTokens  UserPushToken[]
// }

describe('POST /api/users', () => {
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
  it('201: responds with the user denoted by given user_id', async () => {
    const uniqueId = 'id' + new Date().getTime();

    const newUser = {
      username: uniqueId,
      auth_id: 'jkshgfjkhdjfjdsk',
      email: 'test@mail.com',
    };

    const { body } = await request(app.getHttpServer())
      .post('/api/users')
      .send(newUser)
      .set('Accept', 'application/json')
      .expect(201);

    expect(body.username).toBe(uniqueId);
    expect(body.nickname).toBe(uniqueId);
    expect(body.description).toBe('');
    expect(body.auth_id).toBe('jkshgfjkhdjfjdsk');
    expect(body.storage_id).toBe('67fff5f70029bb516bcc');
    expect(body.email).toBe('test@mail.com');
  });

  it('400: responds with user is a dupe', async () => {
    await request(app.getHttpServer()).post('/api/users').send({
      username: 'duplicateUser',
      auth_id: 'somefakeauthid',
      email: 'theoriginaldupe@mail.com',
    });

    const { body } = await request(app.getHttpServer())
      .post('/api/users')
      .send({
        username: 'duplicateUser',
        auth_id: 'fakeauthid',
        email: 'anewemail@mail.com',
      })
      .expect(400);
    expect(body.message).toBe('A User with that username already exists');
  });
});
