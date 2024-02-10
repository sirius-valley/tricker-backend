import { NotFoundException } from '@utils';
import { type UserDTO } from '../dto';
import { type UserRepository } from '../repository';
import { type UserService } from './user.service';

export class UserServiceImpl implements UserService {
  constructor(private readonly repository: UserRepository) {}

  async getById(id: string): Promise<UserDTO> {
    const user = await this.repository.getById(id);
    if (user === null) {
      throw new NotFoundException('User');
    }

    return user;
  }
}
