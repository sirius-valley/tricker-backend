import { type Request, type Response, Router } from 'express';
import { db, validateRequest, validateUserIsProjectManager } from '@utils';
import HttpStatus from 'http-status';
import { type IssueRepository, IssueRepositoryImpl, UserProjectParamsDTO } from '@domains/issue';
import { type DevProjectFiltersDTO, KeyPhraseParamDTO, type PMProjectFiltersDTO, type ProjectBasicDTO, ProjectIdParamDTO } from '@domains/project/dto';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { type ProjectService, ProjectServiceImpl } from '@domains/project/service';
import { type CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { type UserRepository, UserRepositoryImpl } from '@domains/user';
import { type UserProjectRoleRepository, UserProjectRoleRepositoryImpl } from '@domains/userProjectRole/repository';
require('express-async-errors');

const projectRepository: ProjectRepository = new ProjectRepositoryImpl(db);
const issueRepository: IssueRepository = new IssueRepositoryImpl(db);
const userRepository: UserRepository = new UserRepositoryImpl(db);
const userProjectRoleRepository: UserProjectRoleRepository = new UserProjectRoleRepositoryImpl(db);
const service: ProjectService = new ProjectServiceImpl(projectRepository, issueRepository, userRepository, userProjectRoleRepository);

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

projectRouter.get('/', validateRequest(KeyPhraseParamDTO, 'query'), async (req: Request<any, any, any, KeyPhraseParamDTO>, res: Response) => {
  const { projectName } = req.query;
  const { sub } = res.locals.context as CognitoAccessTokenPayload;
  const projects: ProjectBasicDTO[] = await service.getProjectsListByUserIdFiltered({ projectName, userId: sub });

  return res.status(HttpStatus.OK).json(projects);
});

projectRouter.get('/:projectId', validateRequest(ProjectIdParamDTO, 'params'), async (_req: Request<ProjectIdParamDTO>, res: Response) => {
  const { sub } = res.locals.context as CognitoAccessTokenPayload;
  const { projectId } = _req.params;

  const info = await service.getMyProjectView({ cognitoId: sub, projectId });

  return res.status(HttpStatus.OK).json(info);
});

projectRouter.delete('/:projectId', validateRequest(ProjectIdParamDTO, 'params'), async (_req: Request<ProjectIdParamDTO>, res: Response) => {
  const { sub } = res.locals.context as CognitoAccessTokenPayload;
  const { projectId } = _req.params;

  const id = await service.deleteProject({ cognitoId: sub, projectId });

  return res.status(HttpStatus.NO_CONTENT).send(`The project with id: ${id} was successfully deleted.`);
});

projectRouter.delete('/:projectId/member/:userId', validateRequest(UserProjectParamsDTO, 'params'), validateUserIsProjectManager(), async (req: Request<UserProjectParamsDTO>, res: Response) => {
  const { userId, projectId } = req.params;
  const { sub } = res.locals.context as CognitoAccessTokenPayload;

  await service.deleteMember({ userId, projectId, cognitoId: sub });

  return res.status(HttpStatus.NO_CONTENT).send(`The member with id: ${userId} was successfully deleted.`);
});
