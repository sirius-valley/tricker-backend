import { describe, it, mock } from 'node:test';
import request from 'supertest';
import app from '@app';
import { AuthServiceImpl, type TokenDTO } from '@auth';
import assert from 'node:assert';

describe('auth controller tests', () => {
  it('should return jwt token', { skip: true }, async () => {
    mock
      .method(AuthServiceImpl.prototype, 'login')
      .mock.mockImplementation((): TokenDTO => {
        return { token: 'token' };
      });

    const res = await request(app).post('/api/auth/signin').send({
      username: 'username',
      password: 'password',
    });

    assert.equal(200, res.status);
    assert.equal('token', res.body.token);
  });

  it('should return jwt token', { skip: true }, async () => {
    mock
      .method(AuthServiceImpl.prototype, 'signup')
      .mock.mockImplementation((): TokenDTO => {
        return { token: 'token' };
      });

    const res = await request(app).post('/api/auth/signup').send({
      username: 'username',
      password: 'password',
      email: 'email@email.email',
    });

    assert.equal(201, res.status);
    assert.equal('token', res.body.token);
  });
});
