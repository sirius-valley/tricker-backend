import { type Request, type Response, Router } from 'express';
import HttpStatus from 'http-status';
import { type RoleDTO } from '@domains/role/dto';
import { roleService } from '@domains/dependencies';

require('express-async-errors');

export const roleRouter: Router = Router();

roleRouter.get('/', async (req: Request, res: Response) => {
  const roles: RoleDTO[] = await roleService.getRoles();

  return res.status(HttpStatus.OK).json(roles);
});
