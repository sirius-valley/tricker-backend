import { type Request, type Response, Router } from 'express';
import { validateAdminIdentity, validateRequest } from '@utils';
import { type ProjectDTO } from '@domains/project/dto';
import { type CustomCognitoIdTokenPayload } from '@domains/user';
import HttpStatus from 'http-status';
import { ApiKeyDTO, AuthorizationRequestDTO, IssueProviderURLParams, LinearMembersPreIntegrationBody, LinearMembersPreIntegrationParams, MailToken, type PendingProjectInfoDTO, ProjectIdIntegrationInputDTO, type ProjectPreIntegratedDTO } from '@domains/integration/dto';
import { integrationService } from '@dependencies';

require('express-async-errors');

export const integrationRouter: Router = Router();

integrationRouter.post('/:issueProviderName/projects', validateRequest(IssueProviderURLParams, 'params'), validateRequest(ApiKeyDTO, 'body'), async (req: Request<any, any, ApiKeyDTO>, res: Response) => {
  const { key } = req.body;
  const { sub } = res.locals.context as CustomCognitoIdTokenPayload;
  const { issueProviderName } = req.params as IssueProviderURLParams;

  const projects: ProjectPreIntegratedDTO[] = await integrationService.retrieveProjectsFromProvider({ apyKey: key, pmProviderId: sub, issueProviderName: issueProviderName.toLowerCase() });

  return res.status(HttpStatus.OK).json(projects);
});

integrationRouter.post('/:issueProviderName/project/:id/members', validateRequest(LinearMembersPreIntegrationParams, 'params'), validateRequest(LinearMembersPreIntegrationBody, 'body'), async (req: Request, res: Response) => {
  const { id: projectId } = req.params;
  const { apiToken }: { apiToken: string } = req.body;
  const { issueProviderName } = req.params;

  const members = await integrationService.getMembers(projectId, apiToken, issueProviderName.toLowerCase());

  return res.status(HttpStatus.OK).json(members);
});

integrationRouter.get('/:issueProviderName/:projectId/accept', validateRequest(ProjectIdIntegrationInputDTO, 'params'), validateRequest(MailToken, 'query'), validateAdminIdentity(), async (req: Request<ProjectIdIntegrationInputDTO, any, any, MailToken>, res: Response) => {
  const { projectId, issueProviderName } = req.params;

  await integrationService.acceptProject(projectId, issueProviderName.toLowerCase());
  const project: ProjectDTO = await integrationService.integrateProject(projectId, issueProviderName.toLowerCase());

  return res.status(HttpStatus.CREATED).json(project);
});

integrationRouter.post('/:issueProviderName/authorization', validateRequest(IssueProviderURLParams, 'params'), validateRequest(AuthorizationRequestDTO, 'body'), async (_req: Request<any, any, AuthorizationRequestDTO>, res: Response) => {
  const authorizationReq = _req.body;
  const { issueProviderName } = _req.params as IssueProviderURLParams;

  const { pmIsAdmin } = await integrationService.createPendingAuthorization(authorizationReq, issueProviderName.toLowerCase());
  if (pmIsAdmin) {
    res.status(HttpStatus.CREATED).json(pmIsAdmin);
    await integrationService.integrateProject(authorizationReq.projectId, issueProviderName.toLowerCase());
  } else {
    return res.status(HttpStatus.CREATED).json(pmIsAdmin);
  }
});

integrationRouter.get('/:issueProviderName/:projectId/decline', validateRequest(ProjectIdIntegrationInputDTO, 'params'), validateRequest(MailToken, 'query'), validateAdminIdentity(), async (req: Request<ProjectIdIntegrationInputDTO, any, any, MailToken>, res: Response) => {
  const { projectId, issueProviderName } = req.params;

  await integrationService.declineProject(projectId, issueProviderName.toLowerCase());

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
    const { issueProviderName } = req.params as IssueProviderURLParams;

    const pendingProjectInfo: PendingProjectInfoDTO = await integrationService.provideProjectInfo(projectId, issueProviderName.toLowerCase());

    return res.status(HttpStatus.OK).json(pendingProjectInfo);
  }
);
