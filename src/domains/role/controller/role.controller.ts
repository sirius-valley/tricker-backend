import { type Request, type Response, Router } from 'express';
import HttpStatus from 'http-status';
import { db } from '@utils';
import { type RoleService, RoleServiceImpl } from '@domains/role/service';
import { type RoleRepository, RoleRepositoryImpl } from '@domains/role/repository';
import { type RoleDTO } from '@domains/role/dto';
require('express-async-errors');

const repository: RoleRepository = new RoleRepositoryImpl(db);
const service: RoleService = new RoleServiceImpl(repository);
export const roleRouter: Router = Router();

roleRouter.get('/', async (req: Request, res: Response) => {
  const roles: RoleDTO[] = await service.getRoles();

  return res.status(HttpStatus.OK).json(roles);
});
