import { type Request, type Response, Router } from 'express';
import { validateRequest, validateUserIsProjectManager } from '@utils';
import HttpStatus from 'http-status';
import { UserProjectParamsDTO } from '@domains/issue';
import { type DevProjectFiltersDTO, KeyPhraseParamDTO, type PMProjectFiltersDTO, type ProjectBasicDTO, ProjectIdParamDTO } from '@domains/project/dto';
import { type CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { type UserProjectRoleDTO } from '@domains/userProjectRole/dto';
import { projectService } from '@domains/dependencies';

require('express-async-errors');

export const projectRouter = Router();

projectRouter.get('/:projectId/filters/pm', validateRequest(ProjectIdParamDTO, 'params'), validateUserIsProjectManager(), async (req: Request<ProjectIdParamDTO>, res: Response) => {
  const { projectId } = req.params;

  const filters: PMProjectFiltersDTO = await projectService.getPMProjectFilters(projectId);

  return res.status(HttpStatus.OK).json(filters);
});

projectRouter.get('/:projectId/filters/dev', validateRequest(ProjectIdParamDTO, 'params'), async (req: Request<ProjectIdParamDTO>, res: Response) => {
  const { projectId } = req.params;
  const { sub } = res.locals.context as CognitoAccessTokenPayload;

  const filters: DevProjectFiltersDTO = await projectService.getDevProjectFilters({ projectId, userId: sub });

  return res.status(HttpStatus.OK).json(filters);
});

projectRouter.get('/', validateRequest(KeyPhraseParamDTO, 'query'), async (req: Request<any, any, any, KeyPhraseParamDTO>, res: Response) => {
  const { projectName } = req.query;
  const { sub } = res.locals.context as CognitoAccessTokenPayload;
  const projects: ProjectBasicDTO[] = await projectService.getProjectsListByUserIdFiltered({ projectName, userId: sub });

  return res.status(HttpStatus.OK).json(projects);
});

projectRouter.get('/:projectId', validateRequest(ProjectIdParamDTO, 'params'), async (_req: Request<ProjectIdParamDTO>, res: Response) => {
  const { sub } = res.locals.context as CognitoAccessTokenPayload;
  const { projectId } = _req.params;

  const info = await projectService.getMyProjectView({ cognitoId: sub, projectId });

  return res.status(HttpStatus.OK).json(info);
});

projectRouter.delete('/:projectId', validateRequest(ProjectIdParamDTO, 'params'), async (_req: Request<ProjectIdParamDTO>, res: Response) => {
  const { sub } = res.locals.context as CognitoAccessTokenPayload;
  const { projectId } = _req.params;

  const id = await projectService.deleteProject({ cognitoId: sub, projectId });

  return res.status(HttpStatus.NO_CONTENT).send(`The project with id: ${id} was successfully deleted.`);
});

projectRouter.delete('/:projectId/member/:userId', validateRequest(UserProjectParamsDTO, 'params'), validateUserIsProjectManager(), async (req: Request<UserProjectParamsDTO>, res: Response) => {
  const { userId, projectId } = req.params;
  const { sub } = res.locals.context as CognitoAccessTokenPayload;

  await projectService.deleteMember({ userId, projectId, cognitoId: sub });

  return res.status(HttpStatus.NO_CONTENT).send(`The member with id: ${userId} was successfully deleted.`);
});

projectRouter.post('/:projectId/member/:userId', validateRequest(UserProjectParamsDTO, 'params'), validateUserIsProjectManager(), async (req: Request<UserProjectParamsDTO>, res: Response) => {
  const { userId, projectId } = req.params;
  const { sub } = res.locals.context as CognitoAccessTokenPayload;

  const userProjectRole: UserProjectRoleDTO = await projectService.addMember({ userId, projectId, cognitoId: sub });

  return res.status(HttpStatus.OK).json(userProjectRole);
});
