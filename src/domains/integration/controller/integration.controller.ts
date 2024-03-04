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
import { AuthorizationRequest, LinearMembersPreIntegrationBody, LinearMembersPreIntegrationParams, ProjectIdIntegrationInputDTO } from '@domains/integration/dto';
import { type EmailService } from '@email/service/email.service';
import { MailgunEmailService } from '@email/service/mailgun.email.service';
import { mailgunClient } from '@utils/mail';
import { type AdministratorRepository } from '@domains/administrator/repository/administrator.repository';
import { AdministratorRepositoryImpl } from '@domains/administrator/repository/administrator.repository.impl';

require('express-async-errors');

export const integrationRouter: Router = Router();

const projectRepository: ProjectRepository = new ProjectRepositoryImpl(db);
const userRepository: UserRepository = new UserRepositoryImpl(db);
const pendingAuthRepository: PendingProjectAuthorizationRepository = new PendingProjectAuthorizationRepositoryImpl(db);
const projectTool: ProjectManagementToolAdapter = new LinearAdapter();
const pendingMemberMailsRepository: PendingMemberMailsRepository = new PendingMemberMailsRepositoryImpl(db);
const organizationRepository: OrganizationRepository = new OrganizationRepositoryImpl(db);
const administratorRepository: AdministratorRepository = new AdministratorRepositoryImpl(db);
const emailService: EmailService = new MailgunEmailService(mailgunClient);
const service: IntegrationService = new IntegrationServiceImpl(projectTool, projectRepository, userRepository, pendingAuthRepository, pendingMemberMailsRepository, organizationRepository, administratorRepository, emailService);

integrationRouter.post('/linear/project', validateRequest(ProjectIdIntegrationInputDTO, 'body'), async (req: Request<any, any, ProjectIdIntegrationInputDTO>, res: Response) => {
  const { sub } = res.locals.context as CustomCognitoIdTokenPayload;
  const { projectId } = req.body;

  const project: ProjectDTO = await service.integrateProject(projectId, sub);

  res.status(HttpStatus.CREATED).json(project);
});

integrationRouter.get('/linear/project/:id/members', validateRequest(LinearMembersPreIntegrationParams, 'params'), validateRequest(LinearMembersPreIntegrationBody, 'body'), async (_req: Request, res: Response) => {
  const { id: projectId } = _req.params;
  // draft
  // const { apiToken } : { apiToken: string } = _req.body
  // process.env.CURRENT_API_TOKEN = apiToken

  const members = await service.getMembers(projectId);

  return res.status(HttpStatus.OK).json(members);
});

integrationRouter.post('/linear/authorization', validateRequest(AuthorizationRequest, 'body'), async (_req: Request<any, any, AuthorizationRequest>, res: Response) => {
  const authorizationReq = _req.body;

  await service.createPendingAuthorization(authorizationReq);

  return res.status(HttpStatus.CREATED).send();
});
