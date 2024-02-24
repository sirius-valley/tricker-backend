import jwt from 'jsonwebtoken';
import { type Request, type Response } from 'express';
import { Constants } from '@utils';
import { UnauthorizedException } from '@utils/errors';
import { verifyAwsAccessToken } from '@utils/aws';

export const generateAccessToken = (payload: Record<string, string | boolean | number>): string => {
  return jwt.sign(payload, Constants.TOKEN_SECRET, { expiresIn: '1h' });
};

export const withAuth = (req: Request, res: Response, next: () => any): void => {
  const [bearer, token] = req.headers.authorization?.split(' ') ?? [];

  if ((bearer ?? '') === '' || (token ?? '') === '' || bearer !== 'Bearer') throw new UnauthorizedException('MISSING_TOKEN');

  jwt.verify(token, Constants.TOKEN_SECRET, (err, context) => {
    if (err != null) throw new UnauthorizedException('INVALID_TOKEN');
    res.locals.context = context;
    next();
  });
};

export const withAwsAuth = async (req: Request, res: Response, next: () => any): Promise<void> => {
  const [bearer, token] = req.headers.authorization?.split(' ') ?? [];

  if ((bearer ?? '') === '' || (token ?? '') === '' || bearer !== 'Bearer') throw new UnauthorizedException('MISSING_TOKEN');

  try {
    res.locals.context = await verifyAwsAccessToken(token);
    next();
  } catch (e) {
    throw new UnauthorizedException('INVALID_TOKEN');
  }
};
