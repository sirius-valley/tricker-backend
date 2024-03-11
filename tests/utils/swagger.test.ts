import request from 'supertest';
import app from '@app';

describe('documentation tests', () => {
  it('should return status code 301', async () => {
    const res = await request(app).get('/api-docs');
    expect(res.status).toBe(301);
  });
});
