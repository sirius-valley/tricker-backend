import { type Request, type Response, Router } from 'express';
import { db, validateRequest, validateUserIsProjectManager } from '@utils';
import HttpStatus from 'http-status';
import { type IssueRepository, IssueRepositoryImpl } from '@domains/issue';
import { type DevProjectFiltersDTO, type PMProjectFiltersDTO, ProjectIdParamDTO } from '@domains/project/dto';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { type ProjectService, ProjectServiceImpl } from '@domains/project/service';
import { type CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { type UserRepository, UserRepositoryImpl } from '@domains/user';
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
