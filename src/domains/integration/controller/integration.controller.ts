import { type Request, type Response, Router } from 'express';
import HttpStatus from 'http-status';
import { db, validateRequest } from '@utils';
import { type IntegrationService, IntegrationServiceImpl } from '@domains/integration/service';
import { LinearAdapter } from '@domains/adapter/linear/linear.adapter';
import { RoleRepositoryImpl } from '@domains/role/repository';
import { LinearMembersPreIntegrationBody, LinearMembersPreIntegrationParams } from '@domains/integration/dto';

require('express-async-errors');

const integrationService: IntegrationService = new IntegrationServiceImpl(new LinearAdapter(new RoleRepositoryImpl(db)));

export const integrationRouter = Router();

integrationRouter.get('/linear/project/:id/members', validateRequest(LinearMembersPreIntegrationParams, 'params'), validateRequest(LinearMembersPreIntegrationBody, 'body'), async (_req: Request, res: Response) => {
  const { id: projectId } = _req.params;
  // draft
  // const { apiToken } : { apiToken: string } = _req.body
  // process.env.CURRENT_API_TOKEN = apiToken

  const members = await integrationService.getMembers(projectId);

  return res.status(HttpStatus.OK).json(members);
});
