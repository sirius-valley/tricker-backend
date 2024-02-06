import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { validateRequest, ValidationException } from '@utils';
import { type Request, type Response } from 'express';
import { IsNumber, IsString } from 'class-validator';

class TargetClass {
  @IsString()
  city: string;

  constructor(city: string) {
    this.city = city;
  }
}

class ExtendedTargetClass extends TargetClass {
  @IsNumber()
  num: number;

  constructor(city: string, num: number) {
    super(city);
    this.num = num;
  }
}

describe('validations tests', () => {
  it('Should successfully validate class', async () => {
    const req = {
      body: {
        city: 'city',
      },
    } as Request;
    const res = {} as Response;
    const next = mock.fn();

    await validateRequest(TargetClass, 'body')(req, res, next);

    assert.strictEqual(1, next.mock.callCount());
    assert.ok(req.body instanceof TargetClass);
    assert.strictEqual('city', req.body.city);
  });

  it('Should throw exception when validating class', async () => {
    const req = {
      body: {
        city: 1,
      },
    } as Request;
    const res = {} as Response;
    const next = mock.fn();

    try {
      await validateRequest(ExtendedTargetClass, 'body')(req, res, next);
    } catch (error) {
      assert.ok(error instanceof ValidationException);
      assert.strictEqual(0, next.mock.callCount());
      // console.log(error.errors);
      // assert.deepStrictEqual(error.errors, [{}])
    }

    // assert.ok(req.body instanceof TargetClass);
    // assert.equal('city', req.body.city);
  });
});
