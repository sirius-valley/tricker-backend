import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';

import 'express-async-errors';

import { db, validateRequest } from '@utils';

import { AuthService, AuthServiceImpl } from '../service';
import { LoginInputDTO, SignupInputDTO } from '../dto';
import {UserRepositoryImpl} from "@domain/user";

export const authRouter = Router();

const service: AuthService = new AuthServiceImpl(new UserRepositoryImpl(db));

authRouter.post('/signup', validateRequest(SignupInputDTO, 'body'), async (req: Request, res: Response) => {
  const data = req.body;

  const token = await service.signup(data);

  return res.status(HttpStatus.CREATED).json(token);
});

authRouter.post('/signin', validateRequest(LoginInputDTO, 'body'), async (req: Request, res: Response) => {
  const data = req.body;

  const token = await service.login(data);

  return res.status(HttpStatus.OK).json(token);
});
