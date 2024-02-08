import { type UserDTO } from '../dto';

export interface UserService {
  getById: (id: string) => Promise<UserDTO>;
}
