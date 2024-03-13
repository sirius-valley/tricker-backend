import { type Request, type Response, Router } from 'express';
import { db, validateRequest } from '@utils';
import HttpStatus from 'http-status';
import { type IssueService, IssueServiceImpl } from '@domains/issue/service';
import { type IssueRepository, IssueRepositoryImpl } from '@domains/issue/repository';
import { type EventRepository, EventRepositoryImpl } from '@domains/event/repository';
import { IssueWorkedTimeParamsDTO } from '@domains/issue/dto';
require('express-async-errors');

export const issueRouter = Router();

const issueRepo: IssueRepository = new IssueRepositoryImpl(db);
const eventRepo: EventRepository = new EventRepositoryImpl(db);
const service: IssueService = new IssueServiceImpl(issueRepo, eventRepo);

issueRouter.get('/:issueId/worked-time', validateRequest(IssueWorkedTimeParamsDTO, 'params'), async (req: Request<IssueWorkedTimeParamsDTO>, res: Response): Promise<void> => {
  const { issueId } = req.params;

  const workedTime: number = await service.getIssueWorkedSeconds(issueId);

  res.status(HttpStatus.OK).json(workedTime);
});
