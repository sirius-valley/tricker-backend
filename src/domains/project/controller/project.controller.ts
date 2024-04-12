import { type Request, type Response, Router } from 'express';
import { db, validateRequest, validateUserIsProjectManager } from '@utils';
import HttpStatus from 'http-status';
import { type IssueRepository, IssueRepositoryImpl } from '@domains/issue';
import { type DevProjectFiltersDTO, KeyPhraseParamDTO, type PMProjectFiltersDTO, ProjectIdParamDTO } from '@domains/project/dto';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { type ProjectService, ProjectServiceImpl } from '@domains/project/service';
import { type CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { UserParamDTO, type UserRepository, UserRepositoryImpl } from '@domains/user';
require('express-async-errors');

const projectRepository: ProjectRepository = new ProjectRepositoryImpl(db);
const issueRepository: IssueRepository = new IssueRepositoryImpl(db);
const userRepository: UserRepository = new UserRepositoryImpl(db);
const service: ProjectService = new ProjectServiceImpl(projectRepository, issueRepository, userRepository);

export const projectRouter = Router();

projectRouter.get('/:projectId/filters/pm', validateRequest(ProjectIdParamDTO, 'params'), validateUserIsProjectManager(), async (req: Request<ProjectIdParamDTO>, res: Response) => {
  const { projectId } = req.params;

  const filters: PMProjectFiltersDTO = await service.getPMProjectFilters(projectId);

  return res.status(HttpStatus.OK).json(filters);
});

projectRouter.get('/:projectId/filters/dev', validateRequest(ProjectIdParamDTO, 'params'), async (req: Request<ProjectIdParamDTO>, res: Response) => {
  const { projectId } = req.params;
  const { sub } = res.locals.context as CognitoAccessTokenPayload;

  const filters: DevProjectFiltersDTO = await service.getDevProjectFilters({ projectId, userId: sub });

  return res.status(HttpStatus.OK).json(filters);
});

projectRouter.get('/user/:userId', validateRequest(KeyPhraseParamDTO, 'query'), validateRequest(UserParamDTO, 'params'), async (req: Request<UserParamDTO, any, any, KeyPhraseParamDTO>, res: Response) => {
  const { projectName } = req.query;
  const { userId } = req.params;
  const projects = await service.getProjectsListByUserIdFiltered({ projectName, userId });

  return res.status(HttpStatus.OK).json(projects);
});

projectRouter.get('/:projectId', validateRequest(ProjectIdParamDTO, 'params'), async (_req: Request<ProjectIdParamDTO>, res: Response) => {
  const { sub } = res.locals.context as CognitoAccessTokenPayload;
  const { projectId } = _req.params;

  const info = await service.getMyProjectView({ userId: sub, projectId });

  return res.status(200).json(info);
});
