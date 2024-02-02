import { PrismaClient } from '@prisma/client';
import { UserRepository } from './user.repository';
import {UserModel} from "@user/dto";
import {SignupInputDTO} from "@auth/dto";

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(data: SignupInputDTO): Promise<UserModel> {
    return {id: '', password: ''}
  }

  async getByEmailOrUsername(email?: string, username?: string): Promise<UserModel | null> {
    return null
  }

}
