import { validate } from 'class-validator';
import { type NextFunction, type Request, type Response } from 'express';
import { ForbiddenException, NotFoundException, ValidationException } from './errors';
import { plainToInstance } from 'class-transformer';
import { type RoleDTO } from '@domains/role/dto';
import { type UserProjectRoleDTO } from '@domains/userProjectRole/dto';
import { type UserProjectRoleRepository, UserProjectRoleRepositoryImpl } from '@domains/userProjectRole/repository';
import { db } from '@utils/database';
import { type RoleRepository, RoleRepositoryImpl } from '@domains/role/repository';
import { type UserProjectParamsDTO } from '@domains/issue/dto';
import type { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { type UserDTO, type UserRepository, UserRepositoryImpl } from '@domains/user';

export const userProjectRoleRepository: UserProjectRoleRepository = new UserProjectRoleRepositoryImpl(db);
export const roleRepository: RoleRepository = new RoleRepositoryImpl(db);
export const userRepository: UserRepository = new UserRepositoryImpl(db);

export type ClassType<T> = new (...args: any[]) => T;

type RequestPart = 'body' | 'query' | 'params';

export function validateRequest<T>(target: ClassType<T>, reqKey: RequestPart) {
  return async (req: Request<any, any, any, any, any>, res: Response, next: NextFunction) => {
    const instance = plainToInstance(target, req[reqKey]);
    const errors = await validate(instance as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      throw new ValidationException(
        errors.map((error) => ({
          ...error,
          target: undefined,
          value: undefined,
        }))
      );
    }

    req[reqKey] = instance;
    next();
  };
}

/**
 * Retrieves the role of a user in a project.
 * Throws a NotFoundException if the user's role in the project is not found.
 * @returns A Promise resolving to a RoleDTO object representing the user's role in the project.
 * @throws NotFoundException if the user's role in the project is not found.
 * @throws ForbiddenException if the user's role is not Project Manager.
 */
export function validateUserIsProjectManager() {
  return async (req: Request<UserProjectParamsDTO, any, any, any, any>, res: Response, next: NextFunction) => {
    const { projectId } = req.params;
    const { sub } = res.locals.context as CognitoAccessTokenPayload;
    const user: UserDTO | null = await userRepository.getByCognitoId(sub);
    if (user === null || user.deletedAt !== null) {
      throw new NotFoundException('User');
    }
    const userProjectRole: UserProjectRoleDTO | null = await userProjectRoleRepository.getByProjectIdAndUserId({ userId: user.id, projectId });
    if (userProjectRole === null || userProjectRole.deletedAt !== null) {
      throw new NotFoundException('UserProjectRole');
    }
    const role: RoleDTO | null = await roleRepository.getById(userProjectRole.roleId);
    if (role === null) {
      throw new NotFoundException('Role');
    }

    if (role.name.toLowerCase() !== 'project manager') {
      throw new ForbiddenException();
    }

    next();
  };
}
