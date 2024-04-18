import { type Request, type Response, Router } from 'express';
import HttpStatus from 'http-status';

import { validateRequest, validateUserIsProjectManager } from '@utils';
import { type UserDTO } from '../dto';
import { type CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { RoleInputDTO, UserProjectInputDTO, type UserProjectRoleDTO } from '@domains/userProjectRole/dto';
import { userService } from '@dependencies';

require('express-async-errors');

export const userRouter = Router();

userRouter.get('/me', async (_req: Request, res: Response): Promise<Response> => {
  const { sub } = res.locals.context as CognitoAccessTokenPayload;
  const user: UserDTO = await userService.getByProviderUserId(sub);

  return res.status(HttpStatus.OK).json(user);
});

userRouter.post('/getOrCreate', async (_req: Request<any, any, { idToken: string }>, res: Response) => {
  const { idToken } = _req.body;

  const { user, alreadyExists } = await userService.getOrCreateUser(idToken);

  return res.status(alreadyExists ? HttpStatus.OK : HttpStatus.CREATED).json(user);
});

userRouter.post('/:userId/project/:projectId/modification', validateRequest(RoleInputDTO, 'body'), validateRequest(UserProjectInputDTO, 'params'), validateUserIsProjectManager(), async (req: Request<UserProjectInputDTO, any, RoleInputDTO>, res: Response) => {
  const { sub } = res.locals.context as CognitoAccessTokenPayload;
  const { projectId, userId } = req.params;
  const { roleId } = req.body;

  const userProjectRole: UserProjectRoleDTO = await userService.updateUserRoleForAProject({ userId, roleId, projectId, userEmitterCognitoId: sub });

  return res.status(HttpStatus.OK).json(userProjectRole);
});
