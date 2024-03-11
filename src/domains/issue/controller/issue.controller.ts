import { type Request, type Response, Router } from 'express';
import { type IssueService, IssueServiceImpl } from '@domains/issue/service';
import { db, validateRequest } from '@utils';
import { type IssueRepository, IssueRepositoryImpl } from '@domains/issue/repository';
import HttpStatus from 'http-status';
import { type EventRepository, EventRepositoryImpl } from '@domains/event/repository';
import { IssuePauseParams } from '@domains/issue/dto';

export const issueRouter = Router();

const issueRepo: IssueRepository = new IssueRepositoryImpl(db);
const eventRepo: EventRepository = new EventRepositoryImpl(db);
const issueService: IssueService = new IssueServiceImpl(issueRepo, eventRepo);

// todo: document swagger
issueRouter.get('/:id/pause', validateRequest(IssuePauseParams, 'params'), async (_req: Request<IssuePauseParams>, res: Response) => {
  const { id: issueId } = _req.params;

  const event = await issueService.pauseTimer(issueId);

  return res.status(HttpStatus.OK).json({ event });
});
