import { type Request, type Response, Router } from 'express';
import HttpStatus from 'http-status';
import { db, validateRequest } from '@utils';
import { UserRepositoryImpl } from '@user/repository';
// these need to be imported with relative path (..), aliases do not work here
import { type AuthService, AuthServiceImpl } from '../service';
import { LoginInputDTO, SignupInputDTO } from '../dto';

// this needs to be imported with cjs due to missing d.ts file
require('express-async-errors');

export const authRouter = Router();

// Use dependency injection
const service: AuthService = new AuthServiceImpl(new UserRepositoryImpl(db));

// the code is actually valid (typing error from express 4), it's required to suppress this linter error
// eslint-disable-next-line @typescript-eslint/no-misused-promises
authRouter.post('/signup', validateRequest(SignupInputDTO, 'body'), async (req: Request<any, any, SignupInputDTO>, res: Response) => {
  const data = req.body;

  const token = await service.signup(data);

  return res.status(HttpStatus.CREATED).json(token);
});

// the code is actually valid (typing error from express 4), it's required to suppress this linter error
// eslint-disable-next-line @typescript-eslint/no-misused-promises
authRouter.post('/signin', validateRequest(LoginInputDTO, 'body'), async (req: Request<any, any, LoginInputDTO>, res: Response): Promise<Response> => {
  const data = req.body;

  const token = await service.login(data);

  return res.status(HttpStatus.OK).json(token);
});
