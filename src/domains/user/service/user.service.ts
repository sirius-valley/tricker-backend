import { type UserDTO } from '../dto';
import type { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';

export interface UserService {
  getById: (id: string) => Promise<UserDTO>;
  getByProviderUserId: (providerUserId: string) => Promise<UserDTO>;
  createUserWithIdToken: (data: CognitoIdTokenPayload) => Promise<UserDTO>;
  getOrCreateUser: (idToken: string) => Promise<{ user: UserDTO; alreadyExists: boolean }>;
}
