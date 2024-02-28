import { type Request, type Response, Router } from 'express';
import { db, validateRequest } from '@utils';
import { type ProjectDTO } from '@domains/project/dto';
import { LinearAdapter } from '@domains/adapter/linear/linear.adapter';
import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { type CustomCognitoIdTokenPayload, type UserRepository, UserRepositoryImpl } from '@domains/user';
import HttpStatus from 'http-status';
import { type PendingProjectAuthorizationRepository, PendingProjectAuthorizationRepositoryImpl } from 'domains/pendingProjectAuthorization/repository';
import { type PendingMemberMailsRepository, PendingMemberMailsRepositoryImpl } from 'domains/pendingMemberMail/repository';
import { type OrganizationRepository, OrganizationRepositoryImpl } from '@domains/organization/repository';
import { type IntegrationService, IntegrationServiceImpl } from '@domains/integration/service';
import { ProjectIdIntegrationInputDTO } from '@domains/integration/dto';
require('express-async-errors');

export const integrationRouter: Router = Router();

const projectRepository: ProjectRepository = new ProjectRepositoryImpl(db);
const userRepository: UserRepository = new UserRepositoryImpl(db);
const pendingAuthRepository: PendingProjectAuthorizationRepository = new PendingProjectAuthorizationRepositoryImpl(db);
const projectTool: ProjectManagementToolAdapter = new LinearAdapter();
const pendingMemberMailsRepository: PendingMemberMailsRepository = new PendingMemberMailsRepositoryImpl(db);
const organizationRepository: OrganizationRepository = new OrganizationRepositoryImpl(db);
const service: IntegrationService = new IntegrationServiceImpl(projectTool, projectRepository, userRepository, pendingAuthRepository, pendingMemberMailsRepository, organizationRepository);

integrationRouter.post('/project/linear', validateRequest(ProjectIdIntegrationInputDTO, 'body'), async (req: Request<any, any, ProjectIdIntegrationInputDTO>, res: Response) => {
  const { sub } = res.locals.context as CustomCognitoIdTokenPayload;
  const { projectId } = req.body;

  const project: ProjectDTO = await service.integrateProject(projectId, sub);

  res.status(HttpStatus.CREATED).json(project);
});
