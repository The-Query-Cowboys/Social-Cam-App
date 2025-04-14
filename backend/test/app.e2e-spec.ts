import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('GET /api/users', () => {
    test('200: responds with an array of users', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
          const users = body.users;
          users.forEach((user) => {
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
  });

  describe('GET /api/users/:user_id', () => {
    test('200: responds with the user denoted by given user_id', () => {
      return request(app.getHttpServer())
        .get('/api/users/3')
        .expect(200)
        .then(({ body }) => {
          const user = body.user;
          expect(user.user_id).toBe(3);
          expect(user.username).toBe('OscarFinn');
          expect(user.nickname).toBe('Oscar');
          expect(user.description).toBe('Third test user ');
          expect(user.auth_id).toBe('sia_2viJJur679lZKg4F66UiS1PEbSP');
          expect(user.storage_id).toBe('67f938240002514c4ded');
          expect(user.email).toBe('oscar@gmail.com');
        });
    });
  });
});
