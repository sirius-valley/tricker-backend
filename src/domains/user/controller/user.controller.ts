import { type Request, type Response, Router } from 'express';
import HttpStatus from 'http-status';

import { db, validateRequest, validateUserIsProjectManager } from '@utils';
import { type UserDTO } from '../dto';
import { UserRepositoryImpl } from '../repository';
import { type UserService, UserServiceImpl } from '../service';
import { type CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { type UserProjectRoleDTO, UserProjectInputDTO, RoleInputDTO } from '@domains/userProjectRole/dto';
import { type UserProjectRoleRepository, UserProjectRoleRepositoryImpl } from '@domains/userProjectRole/repository';
import { type RoleRepository, RoleRepositoryImpl } from '@domains/role/repository';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';

require('express-async-errors');

export const userRouter = Router();

const userProjectRoleRepository: UserProjectRoleRepository = new UserProjectRoleRepositoryImpl(db);
const roleRepository: RoleRepository = new RoleRepositoryImpl(db);
const projectRepository: ProjectRepository = new ProjectRepositoryImpl(db);
const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db), projectRepository, roleRepository, userProjectRoleRepository);

userRouter.get('/me', async (_req: Request, res: Response): Promise<Response> => {
  const { sub } = res.locals.context as CognitoAccessTokenPayload;
  const user: UserDTO = await service.getByProviderUserId(sub);

  return res.status(HttpStatus.OK).json(user);
});

userRouter.post('/getOrCreate', async (_req: Request<any, any, { idToken: string }>, res: Response) => {
  const { idToken } = _req.body;

  const { user, alreadyExists } = await service.getOrCreateUser(idToken);

  return res.status(alreadyExists ? HttpStatus.OK : HttpStatus.CREATED).json(user);
});

userRouter.post('/:userId/project/:projectId/modification', validateRequest(RoleInputDTO, 'body'), validateRequest(UserProjectInputDTO, 'params'), validateUserIsProjectManager(), async (req: Request<UserProjectInputDTO, any, RoleInputDTO>, res: Response) => {
  const { sub } = res.locals.context as CognitoAccessTokenPayload;
  const { projectId, userId } = req.params;
  const { roleId } = req.body;

  const userProjectRole: UserProjectRoleDTO = await service.updateUserRoleForAProject({ userId, roleId, projectId, userEmitterCognitoId: sub });

  return res.status(HttpStatus.OK).json(userProjectRole);
});
