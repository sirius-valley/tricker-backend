import { type Request, type Response, Router } from 'express';
import { db } from '@utils';
import { type ProjectDTO } from '@domains/project/dto';
import { ProjectServiceImpl } from '@domains/project/service';
import { LinearAdapter } from '@domains/adapter/linearAdapter/linear.adapter';
import { type ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { type UserRepository, UserRepositoryImpl } from '@domains/user';
import { type PendingUserRepository, PendingUserRepositoryImpl } from '@domains/pendingUser/repository';
import { type UserProjectRoleService, UserProjectRoleServiceImpl } from '@domains/userProjectRole/service';
import { type RoleRepository, RoleRepositoryImpl } from '@domains/role/repository';
import { UserProjectRoleRepositoryImpl } from '@domains/userProjectRole/repository';
import HttpStatus from 'http-status';
import { linearClient } from '@context';
import axios from 'axios';

require('express-async-errors');

export const projectRouter = Router();

const projectRepository: ProjectRepository = new ProjectRepositoryImpl(db);
const userRepository: UserRepository = new UserRepositoryImpl(db);
const pendingUserRepository: PendingUserRepository = new PendingUserRepositoryImpl(db);
const roleRepository: RoleRepository = new RoleRepositoryImpl(db);
const projectTool: ProjectManagementTool = new LinearAdapter(linearClient, roleRepository);
const userProjectRole: UserProjectRoleService = new UserProjectRoleServiceImpl(new UserProjectRoleRepositoryImpl(db), userRepository, projectRepository, roleRepository);
const service = new ProjectServiceImpl(projectTool, projectRepository, userRepository, pendingUserRepository, userProjectRole);

projectRouter.post('/integration/linear', async (req: Request, res: Response) => {
  // TO DO: See how data is sent to the endpoint. Another endpoint?
  // TO DO: Create body to validate?
  const { userId } = res.locals.context;
  const { projectId } = req.body;

  const project: ProjectDTO = await service.integrateProject(projectId as string, userId as string);
  await axios.post('http://localhost:8080/api/issues/integrate/linear', {
    projectId: project.id,
  });

  res.status(HttpStatus.CREATED).json(project);
});
