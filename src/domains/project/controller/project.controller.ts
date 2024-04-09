import { type Request, type Response, Router } from 'express';
import { db, validateRequest, validateUserIsProjectManager } from '@utils';
import HttpStatus from 'http-status';
import { type IssueRepository, IssueRepositoryImpl } from '@domains/issue';
import { type DevProjectFiltersDTO, type PMProjectFiltersDTO, ProjectIdParamDTO } from '@domains/project/dto';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { type ProjectService, ProjectServiceImpl } from '@domains/project/service';
import { type CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { type UserRepository, UserRepositoryImpl } from '@domains/user';
import { type UserProjectRoleRepository, UserProjectRoleRepositoryImpl } from '@domains/userProjectRole/repository';
import { type IssueProviderRepository, IssueProviderRepositoryImpl } from '@domains/issueProvider/repository';

require('express-async-errors');

const projectRepository: ProjectRepository = new ProjectRepositoryImpl(db);
const issueRepository: IssueRepository = new IssueRepositoryImpl(db);
const userRepository: UserRepository = new UserRepositoryImpl(db);
const userProjectRoleRepository: UserProjectRoleRepository = new UserProjectRoleRepositoryImpl(db);
const issueProviderRepository: IssueProviderRepository = new IssueProviderRepositoryImpl(db);
const service: ProjectService = new ProjectServiceImpl(projectRepository, issueRepository, userRepository, userProjectRoleRepository, issueProviderRepository);

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

projectRouter.get('/me', async (_req: Request, res: Response) => {
  const { sub } = res.locals.context as CognitoAccessTokenPayload;

  const info = await service.getMyProjectInfo(sub);

  return res.status(200).json(info);
});
