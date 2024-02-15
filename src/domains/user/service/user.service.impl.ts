import { NotFoundException } from '@utils';
import { CreateUserIdTokenDTO, type UserDTO } from '../dto';
import { type UserRepository } from '../repository';
import { type UserService } from './user.service';
import { verifyIdAwsToken } from '@utils/aws';
import { type CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';

export class UserServiceImpl implements UserService {
  constructor(private readonly repository: UserRepository) {}

  async getById(id: string): Promise<UserDTO> {
    const user = await this.repository.getById(id);
    if (user === null) {
      throw new NotFoundException('User');
    }

    return user;
  }

  async getByProviderUserId(providerUserId: string): Promise<UserDTO> {
    const user = await this.repository.getByProviderId(providerUserId);
    if (user === null) {
      throw new NotFoundException('User');
    }

    return user;
  }

  async createUserWithIdToken(data: CognitoIdTokenPayload): Promise<UserDTO> {
    return await this.repository.create(new CreateUserIdTokenDTO(data));
  }

  async getOrCreateUser(idToken: string): Promise<{ user: UserDTO; alreadyExists: boolean }> {
    let alreadyExists = false;
    const payload = await verifyIdAwsToken(idToken);
    let user: UserDTO;

    try {
      user = await this.getByProviderUserId(payload.sub);
      alreadyExists = true;
    } catch (e: any) {
      user = await this.createUserWithIdToken(payload);
    }

    return { user, alreadyExists };
  }
}
