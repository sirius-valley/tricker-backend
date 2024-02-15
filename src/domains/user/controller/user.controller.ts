import { type Request, type Response, Router } from 'express';
import HttpStatus from 'http-status';

import { db } from '@utils';
import { type UserDTO } from '../dto';
import { UserRepositoryImpl } from '../repository';
import { type UserService, UserServiceImpl } from '../service';

require('express-async-errors');

export const userRouter = Router();

const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db));

userRouter.get('/me', async (_req: Request, res: Response): Promise<Response> => {
  const { userId } = res.locals.context;
  const user: UserDTO = await service.getById(userId as string);

  return res.status(HttpStatus.OK).json(user);
});

userRouter.post('/getOrCreate', async (_req: Request<any, any, { idToken: string }>, res: Response) => {
  const { idToken } = _req.body;

  const { user, alreadyExists } = await service.getOrCreateUser(idToken);

  return res.status(alreadyExists ? HttpStatus.OK : HttpStatus.CREATED).json(user);
});
