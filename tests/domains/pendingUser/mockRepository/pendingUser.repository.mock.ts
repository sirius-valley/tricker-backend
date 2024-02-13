import { type PendingUserRepository } from '@domains/pendingUser/repository';
import { type PendingUserDTO } from '@domains/pendingUser/dto';

export class PendingUserRepositoryMock implements PendingUserRepository {
  async create(email: string, projectId: string): Promise<PendingUserDTO> {
    return {
      id: 'id',
      email: 'email@mail.com',
      projectId: 'pid',
      status: 'PENDING',
      createdAt: new Date('2023-11-18T19:28:40.065Z'),
      statusUpdatedAt: null,
    };
  }

  async getByEmailAndProject(email: string, projectId: string): Promise<PendingUserDTO | null> {
    return null;
  }
}
