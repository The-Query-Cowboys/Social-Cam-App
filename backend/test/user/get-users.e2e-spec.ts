import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from '../utils/setup-test';

describe('GET /api/users', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('200: responds with an array of users', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/api/users')
      .expect(200);
    body.forEach((user) => {
      expect(typeof user.user_id).toBe('number');
      expect(typeof user.username).toBe('string');
      expect(typeof user.nickname).toBe('string');
      expect(typeof user.description).toBe('string');
      expect(typeof user.auth_id).toBe('string');
      expect(typeof user.storage_id).toBe('string');
      expect(typeof user.email).toBe('string');
    });
  });
});
