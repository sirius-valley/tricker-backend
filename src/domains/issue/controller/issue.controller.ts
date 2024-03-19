import { type Request, type Response, Router } from 'express';
import { db, validateRequest } from '@utils';
import HttpStatus from 'http-status';
import { type IssueService, IssueServiceImpl } from '@domains/issue/service';
import { type IssueRepository, IssueRepositoryImpl } from '@domains/issue/repository';
import { type EventRepository, EventRepositoryImpl } from '@domains/event/repository';
import { IssueWorkedTimeParamsDTO, IssuePauseParams, type WorkedTimeDTO, ManualTimeModificationRequestDTO } from '@domains/issue/dto';
require('express-async-errors');

export const issueRouter = Router();

const issueRepo: IssueRepository = new IssueRepositoryImpl(db);
const eventRepo: EventRepository = new EventRepositoryImpl(db);
const issueService: IssueService = new IssueServiceImpl(issueRepo, eventRepo);

issueRouter.get('/:issueId/pause', validateRequest(IssuePauseParams, 'params'), async (_req: Request<IssuePauseParams>, res: Response) => {
  const { issueId } = _req.params;

  const event = await issueService.pauseTimer(issueId);

  return res.status(HttpStatus.OK).json(event);
});

issueRouter.get('/:issueId/worked-time', validateRequest(IssueWorkedTimeParamsDTO, 'params'), async (req: Request<IssueWorkedTimeParamsDTO>, res: Response): Promise<Response<number>> => {
  const { issueId } = req.params;

  const workedTime: WorkedTimeDTO = await issueService.getIssueWorkedSeconds(issueId);

  return res.status(HttpStatus.OK).json(workedTime);
});

issueRouter.post('/:issueId/add-time', validateRequest(IssuePauseParams, 'params'), validateRequest(ManualTimeModificationRequestDTO, 'body'), async (_req: Request<IssuePauseParams, any, ManualTimeModificationRequestDTO>, res: Response) => {
  const { issueId } = _req.params;
  const modification = _req.body;

  await issueService.createManualTimeTracking({
    ...modification,
    issueId,
    date: new Date(modification.date),
  });

  return res.sendStatus(HttpStatus.OK);
});

issueRouter.post('/:issueId/remove-time', validateRequest(IssuePauseParams, 'params'), validateRequest(ManualTimeModificationRequestDTO, 'body'), async (_req: Request<IssuePauseParams, any, ManualTimeModificationRequestDTO>, res: Response) => {
  const { issueId } = _req.params;
  const modification = _req.body;

  await issueService.createManualTimeTracking({
    ...modification,
    issueId,
    timeAmount: -modification.timeAmount,
    date: new Date(modification.date),
  });

  return res.sendStatus(HttpStatus.OK);
});
