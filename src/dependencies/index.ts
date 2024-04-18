import { AdapterFactoryImpl } from '@domains/adapter/factory/adapter.factory.impl';
import { type AdapterFactory } from '@domains/adapter/factory/adapter.factory';
import { type ProjectRepository, ProjectRepositoryImpl, type ProjectService, ProjectServiceImpl } from '@domains/project';
import { type UserRepository, UserRepositoryImpl } from '@domains/user';
import { type PendingProjectAuthorizationRepository, PendingProjectAuthorizationRepositoryImpl } from '@domains/pendingProjectAuthorization';
import { type PendingMemberMailsRepository, PendingMemberMailsRepositoryImpl } from '@domains/pendingMemberMail';
import { type OrganizationRepository, OrganizationRepositoryImpl } from '@domains/organization';
import { type EmailService, MailgunEmailService } from '@domains/email';
import { type AdministratorRepository, AdministratorRepositoryImpl } from '@domains/administrator';
import { type IntegrationRepository, IntegrationRepositoryImpl, type IntegrationService, IntegrationServiceImpl } from '@domains/integration';
import { db, mailgunClient } from '@utils';
import { type IssueRepository, IssueRepositoryImpl, type IssueService, IssueServiceImpl } from '@domains/issue';
import { type EventRepository, EventRepositoryImpl } from '@domains/event';
import { type ProjectStageRepository, ProjectStageRepositoryImpl } from '@domains/projectStage';
import { type UserProjectRoleRepository, UserProjectRoleRepositoryImpl } from '@domains/userProjectRole/repository';
import { type IssueProviderRepository, IssueProviderRepositoryImpl, type IssueProviderService, IssueProviderServiceImpl } from '@domains/issueProvider';
import { type RoleRepository, RoleRepositoryImpl, type RoleService, RoleServiceImpl } from '@domains/role';
import { type UserService, UserServiceImpl } from '@domains/user/service';
import { type UserProjectRoleService, UserProjectRoleServiceImpl } from '@domains/userProjectRole/service';
import { LinearDataRetriever } from '@domains/retriever/linear/linear.dataRetriever';
import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { LinearAdapter } from '@domains/adapter/linear/linear.adapter';
import { type ProjectLabelRepository, ProjectLabelRepositoryImpl } from '@domains/projectLabel';

// repositories
const projectRepository: ProjectRepository = new ProjectRepositoryImpl(db);
const userRepository: UserRepository = new UserRepositoryImpl(db);
const pendingAuthRepository: PendingProjectAuthorizationRepository = new PendingProjectAuthorizationRepositoryImpl(db);
const pendingMemberMailsRepository: PendingMemberMailsRepository = new PendingMemberMailsRepositoryImpl(db);
const organizationRepository: OrganizationRepository = new OrganizationRepositoryImpl(db);
const administratorRepository: AdministratorRepository = new AdministratorRepositoryImpl(db);
const integrationRepository: IntegrationRepository = new IntegrationRepositoryImpl(db);
const issueRepository: IssueRepository = new IssueRepositoryImpl(db);
const eventRepository: EventRepository = new EventRepositoryImpl(db);
const projectStageRepository: ProjectStageRepository = new ProjectStageRepositoryImpl(db);
const userProjectRoleRepository: UserProjectRoleRepository = new UserProjectRoleRepositoryImpl(db);
const issueProviderRepository: IssueProviderRepository = new IssueProviderRepositoryImpl(db);
const roleRepository: RoleRepository = new RoleRepositoryImpl(db);
const projectLabelRepository: ProjectLabelRepository = new ProjectLabelRepositoryImpl(db);

// other services
const mailgunEmailService: EmailService = new MailgunEmailService(mailgunClient);

// adapter services
const adapterFactory: AdapterFactory = new AdapterFactoryImpl();
const linearRetriever = new LinearDataRetriever();
const linearAdapter: ProjectManagementToolAdapter = new LinearAdapter(linearRetriever);

// business-related services
const integrationService: IntegrationService = new IntegrationServiceImpl(adapterFactory, projectRepository, userRepository, pendingAuthRepository, pendingMemberMailsRepository, organizationRepository, administratorRepository, integrationRepository, mailgunEmailService);
const issueService: IssueService = new IssueServiceImpl(issueRepository, eventRepository, userRepository, projectRepository, projectStageRepository);
const projectService: ProjectService = new ProjectServiceImpl(projectRepository, issueRepository, userRepository, userProjectRoleRepository);
const issueProviderService: IssueProviderService = new IssueProviderServiceImpl(issueProviderRepository);
const userService: UserService = new UserServiceImpl(userRepository, projectRepository, roleRepository, userProjectRoleRepository);
const userProjectRoleService: UserProjectRoleService = new UserProjectRoleServiceImpl(userProjectRoleRepository, userRepository, projectRepository, roleRepository);
const roleService: RoleService = new RoleServiceImpl(roleRepository);

export {
  projectRepository,
  userRepository,
  pendingAuthRepository,
  pendingMemberMailsRepository,
  organizationRepository,
  administratorRepository,
  integrationRepository,
  issueRepository,
  eventRepository,
  projectStageRepository,
  userProjectRoleRepository,
  issueProviderRepository,
  roleRepository,
  projectLabelRepository,
  adapterFactory,
  linearRetriever,
  linearAdapter,
  integrationService,
  issueService,
  projectService,
  issueProviderService,
  userService,
  userProjectRoleService,
  roleService,
  mailgunEmailService,
};
