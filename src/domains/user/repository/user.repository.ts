import { type UserDTO, type UserModel } from '../dto';

export interface UserRepository {
  create: (id: string) => Promise<UserDTO>;
  getById: (id: string) => Promise<UserDTO | null>;
  getByEmailOrUsername: (email?: string, username?: string) => Promise<UserModel | null>;
}
