import jwt from 'jsonwebtoken';
import { type Request, type Response } from 'express';
import { Constants } from '@utils';
import { UnauthorizedException } from '@utils/errors';
import { verifyAwsAccessToken } from '@utils/aws';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

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

export const encryptData = (data: string, key: string): string => {
  const iv: Buffer = randomBytes(16);
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(key), iv);

  let encrypted: string = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('base64') + ':' + encrypted;
};

export const decryptData = (encryptedData: string, key: string): string => {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts.shift()!, 'base64');
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(key), iv);

  let decrypted = decipher.update(parts.join(':'), 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
