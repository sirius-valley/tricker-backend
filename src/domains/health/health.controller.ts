import { type Request, type Response, Router } from 'express';
import HttpStatus from 'http-status';
export const healthRouter = Router();

healthRouter.get('/', (req: Request, res: Response) => {
  res.sendStatus(HttpStatus.OK);
});
