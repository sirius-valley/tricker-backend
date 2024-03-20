import { type Request, type Response, Router } from 'express';
import { db, validateRequest, validateUserIsProjectManager } from '@utils';
import HttpStatus from 'http-status';
import { type IssueService, IssueServiceImpl } from '@domains/issue/service';
import { type IssueRepository, IssueRepositoryImpl } from '@domains/issue/repository';
import { type EventRepository, EventRepositoryImpl } from '@domains/event/repository';
import { IssueIdParamDTO, type WorkedTimeDTO, UserProjectParamsDTO, type IssueViewDTO, DevOptionalIssueFiltersDTO, PMOptionalIssueFiltersDTO, type IssueExtendedDTO } from '@domains/issue/dto';
import { type UserRepository, UserRepositoryImpl } from '@domains/user';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { IssueAddBlockerParamsDTO } from '@domains/event/dto';
import type { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
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

issueRouter.post('/pm/:userId/project/:projectId', validateRequest(UserProjectParamsDTO, 'params'), validateRequest(PMOptionalIssueFiltersDTO, 'body'), validateUserIsProjectManager(), async (req: Request<UserProjectParamsDTO, any, PMOptionalIssueFiltersDTO>, res: Response) => {
  const { userId, projectId } = req.params;
  const { stageIds, priorities, isOutOfEstimation, assigneeIds, cursor } = req.body;

  const issues: IssueViewDTO[] = await issueService.getPMIssuesFilteredAndPaginated({ userId, projectId, stageIds, priorities, isOutOfEstimation, cursor, assigneeIds });

  return res.status(HttpStatus.OK).json(issues);
});

issueRouter.get('/:issueId/pause', validateRequest(IssueIdParamDTO, 'params'), async (_req: Request<IssueIdParamDTO>, res: Response) => {
  const { issueId } = _req.params;

  const event = await issueService.pauseTimer(issueId);

  return res.status(HttpStatus.OK).json(event);
});

issueRouter.get('/:issueId/worked-time', validateRequest(IssueIdParamDTO, 'params'), async (req: Request<IssueIdParamDTO>, res: Response): Promise<Response<number>> => {
  const { issueId } = req.params;

  const workedTime: WorkedTimeDTO = await issueService.getIssueWorkedSeconds(issueId);

  return res.status(HttpStatus.OK).json(workedTime);
});

issueRouter.post('/:issueId/flag/add', validateRequest(IssueIdParamDTO, 'params'), validateRequest(IssueAddBlockerParamsDTO, 'body'), async (req: Request<IssueIdParamDTO, any, IssueAddBlockerParamsDTO>, res: Response) => {
  const { issueId } = req.params;
  const { sub } = res.locals.context as CognitoAccessTokenPayload;
  const { reason, comment } = req.body;

  console.log('entrando controlador');
  const issue: IssueExtendedDTO = await issueService.blockIssueWithTrickerUI({ issueId, userCognitoId: sub, reason, comment, providerEventId: null });

  return res.status(HttpStatus.OK).json(issue);
});

issueRouter.delete('/:issueId/flag/remove', validateRequest(IssueIdParamDTO, 'params'), async (req: Request<IssueIdParamDTO>, res: Response) => {
  const { issueId } = req.params;
  const { sub } = res.locals.context as CognitoAccessTokenPayload;

  const issue: IssueExtendedDTO = await issueService.unblockIssueWithTrickerUI({ issueId, userCognitoId: sub });

  return res.status(HttpStatus.NO_CONTENT).json(issue);
});
