import { type Request, type Response, Router } from 'express';
import { db, validateRequest } from '@utils';
import { type ProjectDTO, type ProjectPreIntegratedDTO, ProviderSecretDTO } from '@domains/project/dto';
import { ProjectServiceImpl } from '@domains/project/service';
import { LinearAdapter } from '@domains/adapter/linearAdapter/linear.adapter';
import { type ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { type CustomCognitoIdTokenPayload, type UserRepository, UserRepositoryImpl } from '@domains/user';
import { type RoleRepository, RoleRepositoryImpl } from '@domains/role/repository';
import HttpStatus from 'http-status';
import { type ManagementProviderRepository, ManagementProviderRepositoryImpl } from '@domains/managementProvider/repository';
require('express-async-errors');

export const projectRouter: Router = Router();

const projectRepository: ProjectRepository = new ProjectRepositoryImpl(db);
const userRepository: UserRepository = new UserRepositoryImpl(db);
const roleRepository: RoleRepository = new RoleRepositoryImpl(db);
const projectTool: ProjectManagementTool = new LinearAdapter(roleRepository);
const managementProvider: ManagementProviderRepository = new ManagementProviderRepositoryImpl(db);
const service: ProjectServiceImpl = new ProjectServiceImpl(projectTool, projectRepository, userRepository, managementProvider);

projectRouter.post('/integration/linear', async (req: Request, res: Response) => {
  // TO DO: See how data is sent to the endpoint. Another endpoint?
  // TO DO: Create body to validate?
  const { sub } = res.locals.context as CustomCognitoIdTokenPayload;
  const { projectId } = req.body;

  console.log(projectId);

  const project: ProjectDTO = await service.integrateProject(projectId as string, sub);

  res.status(HttpStatus.CREATED).json(project);
});

projectRouter.get('/integration/projects/linear', validateRequest(ProviderSecretDTO, 'query'), async (req: Request, res: Response): Promise<void> => {
  const { secret, provider } = req.query;

  const projects: ProjectPreIntegratedDTO[] = await service.retrieveProjectsFromProvider(provider as string, secret as string);

  res.status(HttpStatus.OK).json(projects);
});
