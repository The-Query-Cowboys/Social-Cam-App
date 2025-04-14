import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';

describe('GET /api/users/:user_id', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('200: responds with the user denoted by given user_id', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/api/users/3')
      .expect(200);

    const user = body.user;
    expect(user.user_id).toBe(3);
    expect(user.username).toBe('OscarFinn');
    expect(user.nickname).toBe('Oscar');
    expect(user.description).toBe('Third test user ');
    expect(user.auth_id).toBe('sia_2viJJur679lZKg4F66UiS1PEbSP');
    expect(user.storage_id).toBe('67f938240002514c4ded');
    expect(user.email).toBe('oscar@gmail.com');
  });

  it('404: responds with a user not found error when user does not exist', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/api/users/9999')
      .expect(404);

    expect(body.msg).toBe('User not found');
  });
});
