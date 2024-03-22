import { NotFoundException } from '@utils';
import { CreateUserIdTokenDTO, type CustomCognitoIdTokenPayload, type UserDTO, type UserUpdateInputDTO } from '../dto';
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
}
