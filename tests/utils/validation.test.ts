import { type Request, type Response } from 'express';
import { validateRequest, ValidationException } from '@utils';
import { IsString, IsNumber } from 'class-validator';

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
    } as unknown as Request;

    const res = {} as unknown as Response;
    const next = jest.fn();

    await validateRequest(TargetClass, 'body')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body).toBeInstanceOf(TargetClass);
    expect(req.body.city).toBe('city');
  });

  it('Should throw exception when validating class', async () => {
    const req = {
      body: {
        city: 1,
      },
    } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn();

    await expect(validateRequest(ExtendedTargetClass, 'body')(req, res, next)).rejects.toThrow(ValidationException);
    expect(next).toHaveBeenCalledTimes(0);
  });
});
