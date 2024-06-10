import { NotFoundException } from '@utils';
import { CreateUserIdTokenDTO, type CustomCognitoIdTokenPayload, type UserDTO, type UserUpdateInputDTO } from '../dto';
import { type UserRepository } from '../repository';
import { type UserService } from './user.service';
import { verifyIdAwsToken } from '@utils/aws';
import type { RoleRepository } from '@domains/role/repository';
import type { UserProjectRoleRepository } from '@domains/userProjectRole/repository';
import type { UserProjectRoleDTO, UserProjectRoleUpdateInput } from '@domains/userProjectRole/dto';
import type { RoleDTO } from '@domains/role/dto';
import type { ProjectDTO } from '@domains/project/dto';
import { type ProjectRepository } from '@domains/project/repository';

export class UserServiceImpl implements UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly roleRepository: RoleRepository,
    private readonly userProjectRoleRepository: UserProjectRoleRepository
  ) {}

  async getById(id: string): Promise<UserDTO> {
    const user = await this.repository.getById(id);
    if (user === null || user.deletedAt != null) {
      throw new NotFoundException('User');
    }

    return user;
  }

  async getByProviderUserId(providerUserId: string): Promise<UserDTO> {
    const user = await this.repository.getByCognitoId(providerUserId);
    if (user === null || user.deletedAt != null) {
      throw new NotFoundException('User');
    }

    return user;
  }

  async createUserWithIdToken(data: CustomCognitoIdTokenPayload): Promise<UserDTO> {
    return await this.repository.create(new CreateUserIdTokenDTO(data));
  }

  /**
   * Retrieves or creates a user based on the provided ID token, verifies the token,
   * and returns user data along with a flag indicating if the user already exists.
   * @param {string} idToken - The ID token used for authentication.
   * @returns {Promise<{ user: UserDTO; alreadyExists: boolean }>} A promise that resolves with user data and an 'alreadyExists' flag.
   * @throws {CustomCognitoIdTokenPayload} If there is an issue with verifying the ID token.
   */
  async getOrCreateUser(idToken: string): Promise<{ user: UserDTO; alreadyExists: boolean }> {
    let alreadyExists: boolean = true;
    const payload: CustomCognitoIdTokenPayload = await verifyIdAwsToken(idToken);
    let user: UserDTO | null;

    user = await this.repository.getByCognitoId(payload.sub);
    if (user === null) {
      user = await this.repository.getByEmail(payload.email);
      if (user === null) {
        user = await this.createUserWithIdToken(payload);
      } else {
        user = await this.registerAlreadyCreatedUser({ cognitoId: payload.sub, name: payload.name, id: user.id });
      }
      alreadyExists = false;
    }
    const createdUser: UserDTO = user!;

    return { user: createdUser, alreadyExists };
  }

  async registerAlreadyCreatedUser(input: UserUpdateInputDTO): Promise<UserDTO | null> {
    return await this.repository.update(input);
  }

  /**
   * This method updates the roles of a user for a project.
   * It validates the input data by ensuring that the project, role, user, and user emitter exist.
   * @param input - The input data for updating user roles for a project.
   * @returns A Promise resolving to the updated user project role.
   * @throws NotFoundException if any of the required entities (user, project, role, or user emitter) are not found.
   */
  async updateUserRoleForAProject(input: UserProjectRoleUpdateInput): Promise<UserProjectRoleDTO> {
    await this.validateProject(input.projectId);
    await this.validateRole(input.roleId);
    await this.validateUser(input.userId);
    const emitter: UserDTO | null = await this.repository.getByCognitoId(input.userEmitterCognitoId);
    if (emitter === null || emitter.deletedAt !== null) {
      throw new NotFoundException('User');
    }
    const userProjectRole: UserProjectRoleDTO | null = await this.userProjectRoleRepository.getByProjectIdAndUserId({ userId: input.userId, projectId: input.projectId });
    if (userProjectRole === null || userProjectRole.deletedAt !== null) {
      throw new NotFoundException('User');
    }

    return await this.userProjectRoleRepository.update({
      projectId: input.projectId,
      userId: input.userId,
      roleId: input.roleId,
      userEmitterId: emitter.id,
      id: userProjectRole.id,
      isAccepted: true,
    });
  }

  /**
   * This method validates the existence of a role.
   * @param roleId - The ID of the role to validate.
   * @throws NotFoundException if the role with the given ID is not found.
   */
  private async validateRole(roleId: string): Promise<void> {
    const role: RoleDTO | null = await this.roleRepository.getById(roleId);
    if (role == null) throw new NotFoundException('Role');
  }

  /**
   * This method validates the existence of a project.
   * @param projectId - The ID of the project to validate.
   * @throws NotFoundException if the project with the given ID is not found or is deleted.
   */
  private async validateProject(projectId: string): Promise<void> {
    const project: ProjectDTO | null = await this.projectRepository.getById(projectId);
    if (project == null || project.deletedAt !== null) throw new NotFoundException('Project');
  }

  /**
   * This method validates the existence of a user.
   * @param userId - The ID of the user to validate.
   * @throws NotFoundException if the user with the given ID is not found or is deleted.
   */
  private async validateUser(userId: string): Promise<void> {
    const userEmitter: UserDTO | null = await this.repository.getById(userId);
    if (userEmitter == null || userEmitter.deletedAt !== null) throw new NotFoundException('User');
  }
}
