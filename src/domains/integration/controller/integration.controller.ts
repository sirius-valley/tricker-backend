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
import { LinearMembersPreIntegrationBody, type ProjectMemberDataDTO, type ProjectPreIntegratedDTO, ProviderKeyDTO } from '@domains/integration/dto';
import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { type PendingProjectAuthorizationRepository, PendingProjectAuthorizationRepositoryImpl } from '@domains/pendingProjectAuthorization/repository';
import { type EmailService, MailgunEmailService } from '@domains/email/service';
import { LinearMembersPreIntegrationParams, ProjectIdIntegrationInputDTO } from '@domains/integration/dto';
import { mailgunClient } from '@utils/mail';
import { LinearDataRetriever } from '@domains/retriever/linear/linear.dataRetriever';

require('express-async-errors');

export const integrationRouter: Router = Router();

const dataRetriever: LinearDataRetriever = new LinearDataRetriever();
const projectRepository: ProjectRepository = new ProjectRepositoryImpl(db);
const userRepository: UserRepository = new UserRepositoryImpl(db);
const pendingAuthRepository: PendingProjectAuthorizationRepository = new PendingProjectAuthorizationRepositoryImpl(db);
const adapter: ProjectManagementToolAdapter = new LinearAdapter(dataRetriever);
const pendingMemberMailsRepository: PendingMemberMailsRepository = new PendingMemberMailsRepositoryImpl(db);
const organizationRepository: OrganizationRepository = new OrganizationRepositoryImpl(db);
const mailSender: EmailService = new MailgunEmailService(mailgunClient);
const service: IntegrationService = new IntegrationServiceImpl(adapter, projectRepository, userRepository, pendingAuthRepository, pendingMemberMailsRepository, organizationRepository, mailSender);

integrationRouter.post('/linear/projects', withAwsAuth, validateRequest(ProviderKeyDTO, 'body'), async (req: Request, res: Response): Promise<void> => {
  const { key, provider } = req.body as unknown as ProviderKeyDTO;
  const { sub } = res.locals.context as CustomCognitoIdTokenPayload;

  const projects: ProjectPreIntegratedDTO[] = await service.retrieveProjectsFromProvider({ providerName: provider, apyKey: key, pmProviderId: sub });

  res.status(HttpStatus.OK).json(projects);
});

integrationRouter.post('/linear/project/:id/members', validateRequest(LinearMembersPreIntegrationParams, 'params'), validateRequest(LinearMembersPreIntegrationBody, 'body'), async (req: Request, res: Response) => {
  const { id: projectId } = req.params;
  const { apiToken }: { apiToken: string } = req.body;

  const members: ProjectMemberDataDTO[] = await service.getMembers(projectId, apiToken);

  return res.status(HttpStatus.OK).json(members);
});

integrationRouter.get('/linear/:projectId/accept', validateRequest(ProjectIdIntegrationInputDTO, 'params'), async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params as unknown as ProjectIdIntegrationInputDTO;
  const { token } = req.query;

  const project: ProjectDTO = await service.integrateProject(projectId, token as string);

  res.status(HttpStatus.CREATED).json(project);
});

integrationRouter.get('/linear/:projectId/decline', validateRequest(ProjectIdIntegrationInputDTO, 'params'), async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params as unknown as ProjectIdIntegrationInputDTO;
  const { token } = req.query;

  await service.declineProject(projectId, token as string);

  res.sendStatus(HttpStatus.NO_CONTENT);
});
