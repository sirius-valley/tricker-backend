import { type Request, type Response, Router } from 'express';
import { db, validateAdminIdentity, validateRequest } from '@utils';
import { type ProjectDTO } from '@domains/project/dto';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { type CustomCognitoIdTokenPayload, type UserRepository, UserRepositoryImpl } from '@domains/user';
import HttpStatus from 'http-status';
import { type PendingMemberMailsRepository, PendingMemberMailsRepositoryImpl } from '@domains/pendingMemberMail/repository';
import { type OrganizationRepository, OrganizationRepositoryImpl } from '@domains/organization/repository';
import { type IntegrationService, IntegrationServiceImpl } from '@domains/integration/service';
import { ApiKeyDTO, AuthorizationRequestDTO, IssueProviderURLParams, LinearMembersPreIntegrationBody, LinearMembersPreIntegrationParams, MailToken, type PendingProjectInfoDTO, ProjectIdIntegrationInputDTO, type ProjectPreIntegratedDTO } from '@domains/integration/dto';
import { type PendingProjectAuthorizationRepository, PendingProjectAuthorizationRepositoryImpl } from '@domains/pendingProjectAuthorization/repository';
import { type EmailService, MailgunEmailService } from '@domains/email/service';
import { mailgunClient } from '@utils/mail';
import { type AdministratorRepository } from '@domains/administrator/repository/administrator.repository';
import { AdministratorRepositoryImpl } from '@domains/administrator/repository/administrator.repository.impl';
import { type IntegrationRepository, IntegrationRepositoryImpl } from '@domains/integration/repository';
import { AdapterProviderImpl } from '@domains/adapter/factory/adapterProviderImpl';
import { WebhookRegistrationStrategyProvider, type WebhookService, WebhookServiceImpl } from '@domains/webhook/service';
import { type WebhookSourceRepository, WebhookSourceRepositoryImpl } from '@domains/webhookSource';
import { type IssueProviderRepository, IssueProviderRepositoryImpl } from '@domains/issueProvider';
import { type EventRepository, EventRepositoryImpl } from '@domains/event';
import { type WebhookConverterProvider, WebhookConverterProviderImpl } from '@domains/webhook/converter';
import { type WebhookActionStrategyProvider, WebhookActionStrategyProviderImpl } from '@domains/webhook/providers';
import { WebhookProcessor } from '@domains/webhook/service/webhook.processor';

require('express-async-errors');

export const integrationRouter: Router = Router();
const webhookConverterProvider: WebhookConverterProvider = new WebhookConverterProviderImpl();
const webhookActionStrategyProvider: WebhookActionStrategyProvider = new WebhookActionStrategyProviderImpl();
const webhookProcessor: WebhookProcessor = new WebhookProcessor(webhookConverterProvider, webhookActionStrategyProvider);
const webhookSourceRepository: WebhookSourceRepository = new WebhookSourceRepositoryImpl(db);
const issueProviderRepository: IssueProviderRepository = new IssueProviderRepositoryImpl(db);
const strategyProvider: WebhookRegistrationStrategyProvider = new WebhookRegistrationStrategyProvider();
const eventRepository: EventRepository = new EventRepositoryImpl(db);
const webhookService: WebhookService = new WebhookServiceImpl(webhookSourceRepository, issueProviderRepository, strategyProvider, eventRepository, webhookProcessor);
const adapterFactory: AdapterProviderImpl = new AdapterProviderImpl();
const projectRepository: ProjectRepository = new ProjectRepositoryImpl(db);
const userRepository: UserRepository = new UserRepositoryImpl(db);
const pendingAuthRepository: PendingProjectAuthorizationRepository = new PendingProjectAuthorizationRepositoryImpl(db);
const pendingMemberMailsRepository: PendingMemberMailsRepository = new PendingMemberMailsRepositoryImpl(db);
const organizationRepository: OrganizationRepository = new OrganizationRepositoryImpl(db);
const emailService: EmailService = new MailgunEmailService(mailgunClient);
const administratorRepository: AdministratorRepository = new AdministratorRepositoryImpl(db);
const integrationRepository: IntegrationRepository = new IntegrationRepositoryImpl(db);
const service: IntegrationService = new IntegrationServiceImpl(adapterFactory, projectRepository, userRepository, pendingAuthRepository, pendingMemberMailsRepository, organizationRepository, administratorRepository, integrationRepository, emailService, webhookService);

integrationRouter.post('/:issueProviderName/projects', validateRequest(IssueProviderURLParams, 'params'), validateRequest(ApiKeyDTO, 'body'), async (req: Request<any, any, ApiKeyDTO>, res: Response) => {
  const { key } = req.body;
  const { sub } = res.locals.context as CustomCognitoIdTokenPayload;
  const { issueProviderName } = req.params as IssueProviderURLParams;

  const projects: ProjectPreIntegratedDTO[] = await service.retrieveProjectsFromProvider({ apyKey: key, pmProviderId: sub, issueProviderName });

  return res.status(HttpStatus.OK).json(projects);
});

integrationRouter.post('/:issueProviderName/project/:id/members', validateRequest(LinearMembersPreIntegrationParams, 'params'), validateRequest(LinearMembersPreIntegrationBody, 'body'), async (req: Request, res: Response) => {
  const { id: projectId } = req.params;
  const { apiToken }: { apiToken: string } = req.body;
  const { issueProviderName } = req.params;

  const members = await service.getMembers(projectId, apiToken, issueProviderName);

  return res.status(HttpStatus.OK).json(members);
});

integrationRouter.get('/:issueProviderName/:projectId/accept', validateRequest(ProjectIdIntegrationInputDTO, 'params'), validateRequest(MailToken, 'query'), validateAdminIdentity(), async (req: Request<ProjectIdIntegrationInputDTO, any, any, MailToken>, res: Response) => {
  const { projectId, issueProviderName } = req.params;

  await service.acceptProject(projectId, issueProviderName);
  const project: ProjectDTO = await service.integrateProject(projectId, issueProviderName);

  return res.status(HttpStatus.CREATED).json(project);
});

integrationRouter.post('/:issueProviderName/authorization', validateRequest(IssueProviderURLParams, 'params'), validateRequest(AuthorizationRequestDTO, 'body'), async (_req: Request<any, any, AuthorizationRequestDTO>, res: Response) => {
  const authorizationReq = _req.body;
  const { issueProviderName } = _req.params as IssueProviderURLParams;

  const { pmIsAdmin } = await service.createPendingAuthorization(authorizationReq, issueProviderName);
  if (pmIsAdmin) {
    res.status(HttpStatus.CREATED).json(pmIsAdmin);
    await service.integrateProject(authorizationReq.projectId, issueProviderName);
  } else {
    return res.status(HttpStatus.CREATED).json(pmIsAdmin);
  }
});

integrationRouter.get('/:issueProviderName/:projectId/decline', validateRequest(ProjectIdIntegrationInputDTO, 'params'), validateRequest(MailToken, 'query'), validateAdminIdentity(), async (req: Request<ProjectIdIntegrationInputDTO, any, any, MailToken>, res: Response) => {
  const { projectId, issueProviderName } = req.params;

  await service.declineProject(projectId, issueProviderName);

  return res.sendStatus(HttpStatus.NO_CONTENT);
});

integrationRouter.get('/:issueProviderName/:projectId/information', validateRequest(ProjectIdIntegrationInputDTO, 'params'), validateRequest(MailToken, 'query'), validateAdminIdentity(), async (req: Request<ProjectIdIntegrationInputDTO, any, any, MailToken>, res: Response) => {
  const { projectId } = req.params;
  const { issueProviderName } = req.params as IssueProviderURLParams;

  const pendingProjectInfo: PendingProjectInfoDTO = await service.provideProjectInfo(projectId, issueProviderName);

  return res.status(HttpStatus.OK).json(pendingProjectInfo);
});
