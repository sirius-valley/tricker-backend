import { type Request, type Response, Router } from 'express';
import { db, validateRequest } from '@utils';
import HttpStatus from 'http-status';
import { type IssueService, IssueServiceImpl } from '@domains/issue/service';
import { type IssueRepository, IssueRepositoryImpl } from '@domains/issue/repository';
import { type EventRepository, EventRepositoryImpl } from '@domains/event/repository';
import { IssueWorkedTimeParamsDTO, IssuePauseParams, type WorkedTimeDTO, UserProjectParamsDTO, type IssueViewDTO, DevOptionalIssueFiltersDTO, PMOptionalIssueFiltersDTO } from '@domains/issue/dto';
import { type UserRepository, UserRepositoryImpl } from '@domains/user';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
require('express-async-errors');

export const issueRouter = Router();

const issueRepo: IssueRepository = new IssueRepositoryImpl(db);
const eventRepo: EventRepository = new EventRepositoryImpl(db);
const userRepo: UserRepository = new UserRepositoryImpl(db);
const projectRepo: ProjectRepository = new ProjectRepositoryImpl(db);
const issueService: IssueService = new IssueServiceImpl(issueRepo, eventRepo, userRepo, projectRepo);

issueRouter.post('/dev/:userId/project/:projectId', validateRequest(UserProjectParamsDTO, 'params'), validateRequest(DevOptionalIssueFiltersDTO, 'body'), async (req: Request<UserProjectParamsDTO, any, DevOptionalIssueFiltersDTO>, res: Response) => {
  const { userId, projectId } = req.params;
  const { stageIds, priorities, isOutOfEstimation, cursor } = req.body;

  const issues: IssueViewDTO[] = await issueService.getDevIssuesFilteredAndPaginated({ userId, projectId, stageIds, priorities, isOutOfEstimation, cursor });

  return res.status(HttpStatus.OK).json(issues);
});

issueRouter.post('/pm/:userId/project/:projectId', validateRequest(UserProjectParamsDTO, 'params'), validateRequest(PMOptionalIssueFiltersDTO, 'body'), async (req: Request<UserProjectParamsDTO, any, PMOptionalIssueFiltersDTO>, res: Response) => {
  const { userId, projectId } = req.params;
  const { stageIds, priorities, isOutOfEstimation, assigneeIds, cursor } = req.body;

  const issues: IssueViewDTO[] = await issueService.getPMIssuesFilteredAndPaginated({ userId, projectId, stageIds, priorities, isOutOfEstimation, cursor, assigneeIds });

  return res.status(HttpStatus.OK).json(issues);
});

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
