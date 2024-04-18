import { type Request, type Response, Router } from 'express';
import { validateRequest, validateUserIsProjectManager } from '@utils';
import HttpStatus from 'http-status';
import { DevOptionalIssueFiltersDTO, type IssueExtendedDTO, IssueIdParamDTO, type IssueViewDTO, ManualTimeModificationRequestDTO, PMOptionalIssueFiltersDTO, UserProjectParamsDTO, type WorkedTimeDTO } from '@domains/issue/dto';
import { type BlockerStatusModificationDTO, type EventHistoryLogDTO, IssueAddBlockerParamsDTO } from '@domains/event/dto';
import { type CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { issueService } from '@domains/dependencies';

require('express-async-errors');

export const issueRouter = Router();

issueRouter.post('/dev/:userId/project/:projectId', validateRequest(UserProjectParamsDTO, 'params'), validateRequest(DevOptionalIssueFiltersDTO, 'body'), async (req: Request<UserProjectParamsDTO, any, DevOptionalIssueFiltersDTO>, res: Response) => {
  const { userId, projectId } = req.params;
  const { stageIds, priorities, isOutOfEstimation, cursor, name } = req.body;

  const issues: IssueViewDTO[] = await issueService.getDevIssuesFilteredAndPaginated({ userId, projectId, stageIds, priorities, isOutOfEstimation, cursor, name });

  return res.status(HttpStatus.OK).json(issues);
});

issueRouter.post('/pm/:userId/project/:projectId', validateRequest(UserProjectParamsDTO, 'params'), validateRequest(PMOptionalIssueFiltersDTO, 'body'), validateUserIsProjectManager(), async (req: Request<UserProjectParamsDTO, any, PMOptionalIssueFiltersDTO>, res: Response) => {
  const { userId, projectId } = req.params;
  const { stageIds, priorities, isOutOfEstimation, assigneeIds, cursor, name } = req.body;

  const issues: IssueViewDTO[] = await issueService.getPMIssuesFilteredAndPaginated({ userId, projectId, stageIds, priorities, isOutOfEstimation, cursor, assigneeIds, name });

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

  return res.status(HttpStatus.NO_CONTENT).send(`The issue with id: ${issueId} was successfully unflagged.`);
});

issueRouter.get('/:issueId', validateRequest(IssueIdParamDTO, 'params'), async (req: Request<IssueIdParamDTO>, res: Response) => {
  const { issueId } = req.params;

  const issue: IssueExtendedDTO = await issueService.getIssueWithChronology(issueId);

  return res.status(HttpStatus.OK).json(issue);
});

issueRouter.get('/:issueId/chronology', validateRequest(IssueIdParamDTO, 'params'), async (req: Request<IssueIdParamDTO>, res: Response) => {
  const { issueId } = req.params;

  const chronology: EventHistoryLogDTO[] = await issueService.getIssueChronology(issueId);

  return res.status(HttpStatus.OK).json(chronology);
});
