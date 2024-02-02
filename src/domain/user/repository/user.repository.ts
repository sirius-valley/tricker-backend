import {UserModel} from "@domain/user/dto";
import {SignupInputDTO} from "@domain/auth/dto";

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserModel>;
  getByEmailOrUsername: (email?: string, username?: string) => Promise<UserModel | null>;
}