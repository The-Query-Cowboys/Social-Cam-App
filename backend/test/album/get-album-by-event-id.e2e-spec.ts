import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupTestApp } from  '../utils/setup-test';

describe('GET /api/albums/:event_id', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await setupTestApp();
    })

    afterAll(async () => {
        await app.close();
    })

    it('200: responds with album id and album name for passed in event_id', async () => {
        const expected = {
            "album_id": 2,
            "album_name": "test album"
        }
        const {body} = await request(app.getHttpServer())
            .get('/api/albums/2')
            .expect(200);
            expect(body).toBe(expected);
    })
})