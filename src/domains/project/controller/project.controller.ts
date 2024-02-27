import { type Request, type Response, Router } from 'express';
import { db } from '@utils';
import { type ProjectDTO } from '@domains/project/dto';
import { ProjectServiceImpl } from '@domains/project/service';
import { LinearAdapter } from '@domains/adapter/linear/linear.adapter';
import { type ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { type CustomCognitoIdTokenPayload, type UserRepository, UserRepositoryImpl } from '@domains/user';
import HttpStatus from 'http-status';
import { type PendingAuthProjectRepository, PendingAuthProjectRepositoryImpl } from '@domains/pendingAuthProject/repository';
require('express-async-errors');

export const projectRouter: Router = Router();

const projectRepository: ProjectRepository = new ProjectRepositoryImpl(db);
const userRepository: UserRepository = new UserRepositoryImpl(db);
const pendingAuthRepository: PendingAuthProjectRepository = new PendingAuthProjectRepositoryImpl(db);
const projectTool: ProjectManagementTool = new LinearAdapter(pendingAuthRepository);
const service: ProjectServiceImpl = new ProjectServiceImpl(projectTool, projectRepository, userRepository);

projectRouter.post('/integration/linear', async (req: Request, res: Response) => {
  // TO DO: See how data is sent to the endpoint. Another endpoint?
  // TO DO: Create body to validate?
  const { sub } = res.locals.context as CustomCognitoIdTokenPayload;
  const { projectId } = req.body;

  console.log(projectId);

  const project: ProjectDTO = await service.integrateProject(projectId as string, sub);

  res.status(HttpStatus.CREATED).json(project);
});
