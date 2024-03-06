import jwt from 'jsonwebtoken';
import { type Request, type Response } from 'express';
import { Constants } from '@utils';
import { UnauthorizedException } from '@utils/errors';
import { verifyAwsAccessToken } from '@utils/aws';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import process from 'process';
import type { MailPayload } from '@domains/integration/dto';

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

export const encryptData = (data: string): string => {
  const key = process.env.ENCRYPT_SECRET!;
  const iv: Buffer = randomBytes(16);
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decryptData = (encryptedData: string): string => {
  const key = process.env.ENCRYPT_SECRET!;
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = Buffer.from(parts[1], 'hex');
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export const verifyToken = (mailToken: string): string => {
  const [bearer, token] = mailToken.split(' ') ?? [];
  if ((bearer ?? '') === '' || (token ?? '') === '' || bearer !== 'Bearer') throw new UnauthorizedException('MISSING_TOKEN');
  let content: MailPayload;
  try {
    content = jwt.verify(token, Constants.TOKEN_SECRET) as MailPayload;
    const { adminId } = content;
    return adminId;
  } catch (e) {
    throw new UnauthorizedException('INVALID_TOKEN');
  }
};
