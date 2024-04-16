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
import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { LinearDataRetriever } from '@domains/retriever/linear/linear.dataRetriever';
import { LinearAdapter } from '@domains/adapter/linear/linear.adapter';

require('express-async-errors');

export const integrationRouter: Router = Router();

const dataRetriever: LinearDataRetriever = new LinearDataRetriever();
const adapter: ProjectManagementToolAdapter = new LinearAdapter(dataRetriever);

const projectRepository: ProjectRepository = new ProjectRepositoryImpl(db);
const userRepository: UserRepository = new UserRepositoryImpl(db);
const pendingAuthRepository: PendingProjectAuthorizationRepository = new PendingProjectAuthorizationRepositoryImpl(db);
const pendingMemberMailsRepository: PendingMemberMailsRepository = new PendingMemberMailsRepositoryImpl(db);
const organizationRepository: OrganizationRepository = new OrganizationRepositoryImpl(db);
const emailService: EmailService = new MailgunEmailService(mailgunClient);
const administratorRepository: AdministratorRepository = new AdministratorRepositoryImpl(db);
const integrationRepository: IntegrationRepository = new IntegrationRepositoryImpl(db);
const service: IntegrationService = new IntegrationServiceImpl(adapter, projectRepository, userRepository, pendingAuthRepository, pendingMemberMailsRepository, organizationRepository, administratorRepository, integrationRepository, emailService);

integrationRouter.post('/:issueProviderName/projects', validateRequest(IssueProviderURLParams, 'params'), validateRequest(ApiKeyDTO, 'body'), async (req: Request<any, any, ApiKeyDTO>, res: Response) => {
  const { key } = req.body;
  const { sub } = res.locals.context as CustomCognitoIdTokenPayload;
  const { issueProviderName } = req.params as IssueProviderURLParams;

  const projects: ProjectPreIntegratedDTO[] = await service.retrieveProjectsFromProvider({ providerName: issueProviderName, apyKey: key, pmProviderId: sub });

  return res.status(HttpStatus.OK).json(projects);
});

integrationRouter.post('/:issueProviderName/project/:id/members', validateRequest(LinearMembersPreIntegrationParams, 'params'), validateRequest(LinearMembersPreIntegrationBody, 'body'), async (req: Request, res: Response) => {
  const { id: projectId } = req.params;
  const { apiToken }: { apiToken: string } = req.body;

  const members = await service.getMembers(projectId, apiToken);

  return res.status(HttpStatus.OK).json(members);
});

integrationRouter.get('/:issueProviderName/:projectId/accept', validateRequest(ProjectIdIntegrationInputDTO, 'params'), validateRequest(MailToken, 'query'), validateAdminIdentity(), async (req: Request<ProjectIdIntegrationInputDTO, any, any, MailToken>, res: Response) => {
  const { projectId, issueProviderName } = req.params;

  await service.acceptProject(projectId);
  const project: ProjectDTO = await service.integrateProject(projectId, issueProviderName);

  return res.status(HttpStatus.CREATED).json(project);
});

integrationRouter.post('/:issueProviderName/authorization', validateRequest(IssueProviderURLParams, 'params'), validateRequest(AuthorizationRequestDTO, 'body'), async (_req: Request<any, any, AuthorizationRequestDTO>, res: Response) => {
  const authorizationReq = _req.body;
  const { issueProviderName } = _req.params as IssueProviderURLParams;

  const { pmIsAdmin } = await service.createPendingAuthorization(authorizationReq);
  if (pmIsAdmin) {
    res.status(HttpStatus.CREATED).json(pmIsAdmin);
    await service.integrateProject(authorizationReq.projectId, issueProviderName);
  } else {
    return res.status(HttpStatus.CREATED).json(pmIsAdmin);
  }
});

integrationRouter.get('/:issueProviderName/:projectId/decline', validateRequest(ProjectIdIntegrationInputDTO, 'params'), validateRequest(MailToken, 'query'), validateAdminIdentity(), async (req: Request<ProjectIdIntegrationInputDTO, any, any, MailToken>, res: Response) => {
  const { projectId } = req.params;

  await service.declineProject(projectId);

  return res.sendStatus(HttpStatus.NO_CONTENT);
});

integrationRouter.get(
  '/:issueProviderName/:projectId/information',
  validateRequest(IssueProviderURLParams, 'params'),
  validateRequest(ProjectIdIntegrationInputDTO, 'params'),
  validateRequest(MailToken, 'query'),
  validateAdminIdentity(),
  async (req: Request<ProjectIdIntegrationInputDTO, any, any, MailToken>, res: Response) => {
    const { projectId } = req.params;
    // const { issueProviderName } = req.params as IssueProviderURLParams;

    const pendingProjectInfo: PendingProjectInfoDTO = await service.provideProjectInfo(projectId);

    return res.status(HttpStatus.OK).json(pendingProjectInfo);
  }
);
