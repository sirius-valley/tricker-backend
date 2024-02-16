import { generateAccessToken } from '@utils/auth';
import { Router, type Request, type Response } from 'express';

export const authRouter = Router();

authRouter.post('/login', async (req: Request, res: Response) => {
  const token = generateAccessToken({ userId: '514b6530-3011-70b9-4701-ea45062a7f38' });

  return res.status(200).json(token);
});
