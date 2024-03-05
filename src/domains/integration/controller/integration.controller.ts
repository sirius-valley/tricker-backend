import { type Request, type Response, Router } from 'express';
import { db, validateRequest, withAwsAuth } from '@utils';
import { type ProjectDTO } from '@domains/project/dto';
import { LinearAdapter } from '@domains/adapter/linear/linear.adapter';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { type CustomCognitoIdTokenPayload, type UserRepository, UserRepositoryImpl } from '@domains/user';
import HttpStatus from 'http-status';
import { type PendingMemberMailsRepository, PendingMemberMailsRepositoryImpl } from '@domains/pendingMemberMail/repository';
import { type OrganizationRepository, OrganizationRepositoryImpl } from '@domains/organization/repository';
import { type IntegrationService, IntegrationServiceImpl } from '@domains/integration/service';
import { AuthorizationRequest, LinearMembersPreIntegrationBody, type ProjectPreIntegratedDTO, ProviderKeyDTO } from '@domains/integration/dto';
import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { type PendingProjectAuthorizationRepository, PendingProjectAuthorizationRepositoryImpl } from '@domains/pendingProjectAuthorization/repository';
import { type EmailService, MailgunEmailService } from '@domains/email/service';
import { LinearMembersPreIntegrationParams, ProjectIdIntegrationInputDTO } from '@domains/integration/dto';
import { mailgunClient } from '@utils/mail';
import { LinearDataRetriever } from '@domains/retriever/linear/linear.dataRetriever';
import { type AdministratorRepository } from '@domains/administrator/repository/administrator.repository';
import { type IntegrationRepository } from '@domains/integration/repository/integration.repository';
import { AdministratorRepositoryImpl } from '@domains/administrator/repository/administrator.repository.impl';
import { IntegrationRepositoryImpl } from '@domains/integration/repository/integration.repository.impl';

require('express-async-errors');

export const integrationRouter: Router = Router();

const dataRetriever: LinearDataRetriever = new LinearDataRetriever();
const projectRepository: ProjectRepository = new ProjectRepositoryImpl(db);
const userRepository: UserRepository = new UserRepositoryImpl(db);
const pendingAuthRepository: PendingProjectAuthorizationRepository = new PendingProjectAuthorizationRepositoryImpl(db);
const adapter: ProjectManagementToolAdapter = new LinearAdapter(dataRetriever);
const pendingMemberMailsRepository: PendingMemberMailsRepository = new PendingMemberMailsRepositoryImpl(db);
const organizationRepository: OrganizationRepository = new OrganizationRepositoryImpl(db);
const emailService: EmailService = new MailgunEmailService(mailgunClient);
const administratorRepository: AdministratorRepository = new AdministratorRepositoryImpl(db);
const integrationRepository: IntegrationRepository = new IntegrationRepositoryImpl(db);
const service: IntegrationService = new IntegrationServiceImpl(adapter, projectRepository, userRepository, pendingAuthRepository, pendingMemberMailsRepository, organizationRepository, administratorRepository, integrationRepository, emailService);

integrationRouter.post('/linear/projects', withAwsAuth, validateRequest(ProviderKeyDTO, 'body'), async (req: Request, res: Response): Promise<void> => {
  const { key, provider } = req.body as unknown as ProviderKeyDTO;
  const { sub } = res.locals.context as CustomCognitoIdTokenPayload;

  const projects: ProjectPreIntegratedDTO[] = await service.retrieveProjectsFromProvider({ providerName: provider, apyKey: key, pmProviderId: sub });

  res.status(HttpStatus.OK).json(projects);
});

integrationRouter.post('/linear/project/:id/members', withAwsAuth, validateRequest(LinearMembersPreIntegrationParams, 'params'), validateRequest(LinearMembersPreIntegrationBody, 'body'), async (req: Request, res: Response) => {
  const { id: projectId } = req.params;
  const { apiToken }: { apiToken: string } = req.body;

  const members = await service.getMembers(projectId, apiToken);

  return res.status(HttpStatus.OK).json(members);
});

integrationRouter.get('/linear/:projectId/accept', validateRequest(ProjectIdIntegrationInputDTO, 'params'), async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params as unknown as ProjectIdIntegrationInputDTO;

  const project: ProjectDTO = await service.integrateProject(projectId);

  res.status(HttpStatus.CREATED).json(project);
});

integrationRouter.post('/linear/authorization', withAwsAuth, validateRequest(AuthorizationRequest, 'body'), async (_req: Request<any, any, AuthorizationRequest>, res: Response) => {
  const authorizationReq = _req.body;

  await service.createPendingAuthorization(authorizationReq);

  return res.status(HttpStatus.CREATED).send();
});
