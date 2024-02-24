import { type CustomCognitoIdTokenPayload, type UserDTO } from '../dto';

export interface UserService {
  getById: (id: string) => Promise<UserDTO>;
  getByProviderUserId: (providerUserId: string) => Promise<UserDTO>;
  createUserWithIdToken: (data: CustomCognitoIdTokenPayload) => Promise<UserDTO>;
  getOrCreateUser: (idToken: string) => Promise<{ user: UserDTO; alreadyExists: boolean }>;
}
