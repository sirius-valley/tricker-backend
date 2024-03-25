import { type Request, type Response, Router } from 'express';
import { db, validateRequest, validateUserIsProjectManager } from '@utils';
import HttpStatus from 'http-status';
import { type IssueService, IssueServiceImpl } from '@domains/issue/service';
import { type IssueRepository, IssueRepositoryImpl } from '@domains/issue/repository';
import { type EventRepository, EventRepositoryImpl } from '@domains/event/repository';
import { IssueIdParamDTO, type WorkedTimeDTO, UserProjectParamsDTO, type IssueViewDTO, DevOptionalIssueFiltersDTO, PMOptionalIssueFiltersDTO, type IssueExtendedDTO, ManualTimeModificationRequestDTO } from '@domains/issue/dto';
import { type UserRepository, UserRepositoryImpl } from '@domains/user';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { type ProjectStageRepository, ProjectStageRepositoryImpl } from '@domains/projectStage/repository';
import { type BlockerStatusModificationDTO, IssueAddBlockerParamsDTO } from '@domains/event/dto';
import { type CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
require('express-async-errors');

export const issueRouter = Router();

const issueRepo: IssueRepository = new IssueRepositoryImpl(db);
const eventRepo: EventRepository = new EventRepositoryImpl(db);
const userRepo: UserRepository = new UserRepositoryImpl(db);
const projectRepo: ProjectRepository = new ProjectRepositoryImpl(db);
const projectStageRepo: ProjectStageRepository = new ProjectStageRepositoryImpl(db);
const issueService: IssueService = new IssueServiceImpl(issueRepo, eventRepo, userRepo, projectRepo, projectStageRepo);

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

issueRouter.post('/:issueId/pause', validateRequest(IssueIdParamDTO, 'params'), async (_req: Request<IssueIdParamDTO>, res: Response) => {
  const { issueId } = _req.params;

  const event = await issueService.pauseTimer(issueId);

  return res.status(HttpStatus.CREATED).json(event);
});

issueRouter.post('/:issueId/resume', validateRequest(IssueIdParamDTO, 'params'), async (_req: Request<IssueIdParamDTO>, res: Response) => {
  const { issueId } = _req.params;

  const event = await issueService.resumeTimer(issueId);

  return res.status(HttpStatus.CREATED).json(event);
});

issueRouter.get('/:issueId/worked-time', validateRequest(IssueIdParamDTO, 'params'), async (req: Request<IssueIdParamDTO>, res: Response): Promise<Response<number>> => {
  const { issueId } = req.params;

  const workedTime: WorkedTimeDTO = await issueService.getIssueWorkedSeconds(issueId);

  return res.status(HttpStatus.OK).json(workedTime);
});

issueRouter.post('/:issueId/add-time', validateRequest(IssueIdParamDTO, 'params'), validateRequest(ManualTimeModificationRequestDTO, 'body'), async (_req: Request<IssueIdParamDTO, any, ManualTimeModificationRequestDTO>, res: Response) => {
  const { issueId } = _req.params;
  const modification = _req.body;

  await issueService.createManualTimeTracking({
    ...modification,
    issueId,
    date: new Date(modification.date),
  });

  return res.sendStatus(HttpStatus.OK);
});

issueRouter.post('/:issueId/remove-time', validateRequest(IssueIdParamDTO, 'params'), validateRequest(ManualTimeModificationRequestDTO, 'body'), async (_req: Request<IssueIdParamDTO, any, ManualTimeModificationRequestDTO>, res: Response) => {
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

issueRouter.post('/:issueId/flag/add', validateRequest(IssueIdParamDTO, 'params'), validateRequest(IssueAddBlockerParamsDTO, 'body'), async (req: Request<IssueIdParamDTO, any, IssueAddBlockerParamsDTO>, res: Response) => {
  const { issueId } = req.params;
  const { sub } = res.locals.context as CognitoAccessTokenPayload;
  const { reason, comment } = req.body;

  const event: BlockerStatusModificationDTO = await issueService.blockIssueWithTrickerUI({ issueId, userCognitoId: sub, reason, comment, providerEventId: null });

  return res.status(HttpStatus.OK).json(event);
});

issueRouter.delete('/:issueId/flag/remove', validateRequest(IssueIdParamDTO, 'params'), async (req: Request<IssueIdParamDTO>, res: Response) => {
  const { issueId } = req.params;
  const { sub } = res.locals.context as CognitoAccessTokenPayload;

  await issueService.unblockIssueWithTrickerUI({ issueId, userCognitoId: sub });

  return res.sendStatus(HttpStatus.NO_CONTENT);
});

issueRouter.get('/:issueId', validateRequest(IssueIdParamDTO, 'params'), async (req: Request<IssueIdParamDTO>, res: Response) => {
  const { issueId } = req.params;

  const issue: IssueExtendedDTO = await issueService.getIssueWithChronology(issueId);

  return res.status(HttpStatus.OK).json(issue);
});
