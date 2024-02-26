import { NotFoundException } from '@utils';
import { CreateUserIdTokenDTO, type CustomCognitoIdTokenPayload, type UserDTO } from '../dto';
import { type UserRepository } from '../repository';
import { type UserService } from './user.service';
import { verifyIdAwsToken } from '@utils/aws';

export class UserServiceImpl implements UserService {
  constructor(private readonly repository: UserRepository) {}

  async getById(id: string): Promise<UserDTO> {
    const user = await this.repository.getById(id);
    if (user === null || user.deletedAt != null) {
      throw new NotFoundException('User');
    }

    return user;
  }

  async getByProviderUserId(providerUserId: string): Promise<UserDTO> {
    const user = await this.repository.getByProviderId(providerUserId);
    if (user === null || user.deletedAt != null) {
      throw new NotFoundException('User');
    }

    return user;
  }

  async createUserWithIdToken(data: CustomCognitoIdTokenPayload): Promise<UserDTO> {
    return await this.repository.create(new CreateUserIdTokenDTO(data));
  }

  async getOrCreateUser(idToken: string): Promise<{ user: UserDTO; alreadyExists: boolean }> {
    let alreadyExists: boolean = true;
    const payload: CustomCognitoIdTokenPayload = await verifyIdAwsToken(idToken);
    let user: UserDTO | null;

    user = await this.repository.getByProviderId(payload.sub);
    if (user === null) {
      user = await this.repository.getByEmail(payload.email);
      if (user === null) {
        user = await this.createUserWithIdToken(payload);
      } else {
        user = await this.repository.registerAlreadyCreatedUser(payload.sub, payload.name, user.id);
      }
      alreadyExists = false;
    }
    const createdUser: UserDTO = user!;

    return { user: createdUser, alreadyExists };
  }
}
