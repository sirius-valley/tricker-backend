import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '@app';

void describe('documentation tests', () => {
  void it('should return status code 200', async (_t): Promise<void> => {
    const res = await request(app).get('/api-docs');
    assert.equal(301, res.status);
  });
});
