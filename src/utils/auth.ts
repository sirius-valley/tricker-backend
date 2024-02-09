import jwt from 'jsonwebtoken';
import { type Request, type Response } from 'express';
import { Constants } from '@utils';
import { UnauthorizedException } from '@utils/errors';

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
