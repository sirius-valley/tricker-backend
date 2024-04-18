import { type Request, type Response, Router } from 'express';
import HttpStatus from 'http-status';
import { issueProviderService } from '@dependencies';

export const issueProviderRouter = Router();

issueProviderRouter.get('/', async (_req: Request, res: Response) => {
  const providers = issueProviderService.getAll();

  return res.status(HttpStatus.OK).json(providers);
});
