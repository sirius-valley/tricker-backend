import { db, validateRequest } from '@utils';
import { ProviderSecretDTO } from '@domains/project/dto';
import { type Request, type Response, Router } from 'express';
import { type ProjectPreIntegratedDTO } from '@domains/integration/dto';
import HttpStatus from 'http-status';
import { IntegrationServiceImpl } from '@domains/integration/service/integration.service.impl';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { type IssueProviderRepository, IssueProviderRepositoryImpl } from '@domains/issueProvider/repository';
import { LinearAdapter } from '@domains/adapter/linear/linear.adapter';
import { RoleRepositoryImpl } from '@domains/role/repository';
import { type IntegrationService } from '@domains/integration/service/integration.service';
require('express-async-errors');

const projectRepository: ProjectRepository = new ProjectRepositoryImpl(db);
const issueProviderRepository: IssueProviderRepository = new IssueProviderRepositoryImpl(db);
const adapter: LinearAdapter = new LinearAdapter(new RoleRepositoryImpl(db));
const service: IntegrationService = new IntegrationServiceImpl(adapter, projectRepository, issueProviderRepository);

export const integrationRouter = Router();

integrationRouter.get('/integration/projects/linear', validateRequest(ProviderSecretDTO, 'query'), async (req: Request, res: Response): Promise<void> => {
  const { secret, provider } = req.query as unknown as ProviderSecretDTO;

  const projects: ProjectPreIntegratedDTO[] = await service.retrieveProjectsFromProvider(provider, secret);

  res.status(HttpStatus.OK).json(projects);
});
