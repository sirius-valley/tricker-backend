import { type Request, type Response, Router } from 'express';
import { db, validateRequest, withAwsAuth } from '@utils';
import { type ProjectDTO, ProviderKeyDTO } from '@domains/project/dto';
import { LinearAdapter } from '@domains/adapter/linear/linear.adapter';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { type CustomCognitoIdTokenPayload, type UserRepository, UserRepositoryImpl } from '@domains/user';
import HttpStatus from 'http-status';
import { type PendingMemberMailsRepository, PendingMemberMailsRepositoryImpl } from 'domains/pendingMemberMail/repository';
import { type OrganizationRepository, OrganizationRepositoryImpl } from '@domains/organization/repository';
import { type IntegrationService, IntegrationServiceImpl } from '@domains/integration/service';
import { ProjectIdIntegrationInputDTO, type ProjectPreIntegratedDTO } from '@domains/integration/dto';
import { type IssueProviderRepository, IssueProviderRepositoryImpl } from '@domains/issueProvider/repository';
import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { type PendingProjectAuthorizationRepository, PendingProjectAuthorizationRepositoryImpl } from '@domains/pendingProjectAuthorization/repository';
require('express-async-errors');

export const integrationRouter: Router = Router();

const projectRepository: ProjectRepository = new ProjectRepositoryImpl(db);
const userRepository: UserRepository = new UserRepositoryImpl(db);
const pendingAuthRepository: PendingProjectAuthorizationRepository = new PendingProjectAuthorizationRepositoryImpl(db);
const adapter: ProjectManagementToolAdapter = new LinearAdapter();
const pendingMemberMailsRepository: PendingMemberMailsRepository = new PendingMemberMailsRepositoryImpl(db);
const organizationRepository: OrganizationRepository = new OrganizationRepositoryImpl(db);
const issueProviderRepository: IssueProviderRepository = new IssueProviderRepositoryImpl(db);
const service: IntegrationService = new IntegrationServiceImpl(adapter, projectRepository, userRepository, pendingAuthRepository, pendingMemberMailsRepository, organizationRepository, issueProviderRepository);

integrationRouter.post('/project/linear', validateRequest(ProjectIdIntegrationInputDTO, 'body'), async (req: Request<any, any, ProjectIdIntegrationInputDTO>, res: Response) => {
  const { projectId } = req.body;

  const project: ProjectDTO = await service.integrateProject(projectId);

  res.status(HttpStatus.CREATED).json(project);
});

integrationRouter.get('/projects/linear', withAwsAuth, validateRequest(ProviderKeyDTO, 'query'), async (req: Request, res: Response): Promise<void> => {
  const { key, provider } = req.query as unknown as ProviderKeyDTO;
  const { sub } = res.locals.context as CustomCognitoIdTokenPayload;

  const projects: ProjectPreIntegratedDTO[] = await service.retrieveProjectsFromProvider({ providerName: provider, apyKey: key, pmProviderId: sub });

  res.status(HttpStatus.OK).json(projects);
});
