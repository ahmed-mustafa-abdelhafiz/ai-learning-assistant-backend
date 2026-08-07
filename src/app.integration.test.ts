import request from 'supertest';
import { app } from './app.js';

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'ok',
      environment: expect.any(String),
      timestamp: expect.any(String),
      uptime: expect.any(Number),
      database: 'connected',
    });
  });

  it('returns a valid ISO timestamp', async () => {
    const res = await request(app).get('/health');

    expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
  });
});
