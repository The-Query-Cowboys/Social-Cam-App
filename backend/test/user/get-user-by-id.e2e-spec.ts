import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';
import { PrismaService } from '../../src/prisma.service';
import { cleanupAfterAll } from '../utils/end-test';

describe('GET /api/users/:user_id', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await setupTestApp();
    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await cleanupAfterAll(app, prisma);
  }, 15000);

  it('200: responds with the user denoted by given user_id', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/api/users/13')
      .expect(200);
    expect(body.user_id).toBe(13);
    expect(body.username).toBe('OscarFinn');
    expect(body.nickname).toBe('Oscar');
    expect(body.description).toBe('Third test user');
    expect(body.auth_id).toBe('sia_2viJJur679lZKg4F66UiS1PEbSP');
    expect(body.storage_id).toBe('67f938240002514c4ded');
    expect(body.email).toBe('oscar@gmail.com');
  });

  it('404: responds with a user not found error when user does not exist', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/api/users/9999')
      .expect(404);
    expect(body.message).toBe('User_id 9999 was not found');
  });
});
