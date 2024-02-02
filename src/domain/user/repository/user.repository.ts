import { SignupInputDTO } from '@domains/auth/dto';
import {UserModel} from "@domain/user/dto";

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserModel>;
  getByEmailOrUsername: (email?: string, username?: string) => Promise<UserModel | null>;
}