import { type SignupInputDTO } from '@domains/auth';
import { type UserDTO, type UserModel } from '../dto';

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserModel>;
  getById: (id: string) => Promise<UserDTO | null>;
  getByEmailOrUsername: (email?: string, username?: string) => Promise<UserModel | null>;
  getByProviderId: (providerId: string) => Promise<UserModel | null>;
}
