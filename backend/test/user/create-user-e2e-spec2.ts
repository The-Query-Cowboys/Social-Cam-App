import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';

describe('POST /api/users/', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('201: responds with the user denoted by given user_id', async () => {
    const uniqueId = "id" + (new Date().getTime())

    const newUser = {
      username: uniqueId,
      nickname: "test user",
      description: "test user",
      auth_id: "jkshgfjkhdjfjdsk",
      email: "test@mail.com"
    }

    const { body } = await request(app.getHttpServer())
      .post('/api/users')
      .send(newUser)
      .set("Accept", "application/json")
      .expect(201);

    expect(body.username).toBe(uniqueId);
    expect(body.nickname).toBe('test user');
    expect(body.description).toBe('test user');
    expect(body.auth_id).toBe('jkshgfjkhdjfjdsk');
    expect(body.storage_id).toBe('67fff5f70029bb516bcc');
    expect(body.email).toBe('test@mail.com');
  });

  it('404: responds with user is a dupe', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/api/users')
      .send({
        username: "3333",
      })
      .expect(404);
    expect(body.message).toBe('User_id 9999 was not found');
  });
});
