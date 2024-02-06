import { type PrismaClient } from '@prisma/client';
import { type UserRepository } from '@user';
import { type UserModel } from '@user/dto';
import { type SignupInputDTO } from '@auth/dto';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(data: SignupInputDTO): Promise<UserModel> {
    return { id: '', password: '' };
  }

  async getByEmailOrUsername(email?: string, username?: string): Promise<UserModel | null> {
    return null;
  }
}
