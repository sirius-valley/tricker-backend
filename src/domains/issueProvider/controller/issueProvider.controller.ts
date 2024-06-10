import { type Request, type Response, Router } from 'express';
import HttpStatus from 'http-status';
import { IssueProviderServiceImpl } from '@domains/issueProvider/service';
import { db } from '@utils';
import { IssueProviderRepositoryImpl } from '@domains/issueProvider/repository';

const issueProviderService = new IssueProviderServiceImpl(new IssueProviderRepositoryImpl(db));

export const issueProviderRouter = Router();

issueProviderRouter.get('/', async (_req: Request, res: Response) => {
  const providers = issueProviderService.getAll();

  return res.status(HttpStatus.OK).json(providers);
});
