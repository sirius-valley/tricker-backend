import { type CreateUserIdTokenDTO, type UserDTO } from '../dto';

export interface UserRepository {
  create: (data: CreateUserIdTokenDTO) => Promise<UserDTO>;
  createWithoutCognitoId: (email: string) => Promise<UserDTO>;
  getById: (id: string) => Promise<UserDTO | null>;
  getByProviderId: (providerId: string) => Promise<UserDTO | null>;
  getByEmail: (email: string) => Promise<UserDTO | null>;
  registerAlreadyCreatedUser: (cognitoId: string, name: string, id: string) => Promise<UserDTO | null>;
}
