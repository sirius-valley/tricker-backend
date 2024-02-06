import { type UserModel } from '@user/dto';
import { type SignupInputDTO } from '@auth/dto';

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserModel>;
  getByEmailOrUsername: (email?: string, username?: string) => Promise<UserModel | null>;
}
