import { describe, it } from 'node:test';
import axios from 'axios';
import assert from 'node:assert';

void describe('documentation', () => {
  void it('should return status code 200', async (_t): Promise<void> => {
    const res = await axios.get('http://localhost:8080/api-docs');
    assert.equal(200, res.status);
  });
});
